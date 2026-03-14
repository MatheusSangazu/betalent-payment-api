import db from '@adonisjs/lucid/services/db'
import Client from '#models/client'
import Product from '#models/product'
import Transaction from '#models/transaction'
import TransactionProduct from '#models/transaction_product'
import Gateway from '#models/gateway'
import GatewayService from '#services/gateway_service'
import { inject } from '@adonisjs/core'

/**
 * Serviço responsável por gerenciar as transações de pagamento
 */
@inject()
export default class TransactionService {
  constructor(protected gatewayService: GatewayService) {}

  /**
   * Retorna todas as transações com filtros opcionais
   */
  public async getAllTransactions(filters: {
    client_name?: string
    status?: string
    date_from?: string
    date_to?: string
  }) {
    const query = Transaction.query()
      // Carrega os dados do cliente e produtos (Eager Loading)
      .preload('client')
      .preload('transactionProducts', (tpQuery) => {
        tpQuery.preload('product')
      })

    // Filtro por nome do cliente (busca parcial)
    if (filters.client_name) {
      query.whereHas('client', (clientQuery) => {
        clientQuery.where('name', 'like', `%${filters.client_name}%`)
      })
    }

    // Filtro por status (APPROVED ou FAILED)
    if (filters.status) {
      query.where('status', filters.status)
    }

    // Filtro por intervalo de datas (createdAt)
    if (filters.date_from) {
      const fromDate = `${filters.date_from} 00:00:00`
      query.where('createdAt', '>=', fromDate)
    }

    if (filters.date_to) {
      const toDate = `${filters.date_to} 23:59:59`
      query.where('createdAt', '<=', toDate)
    }

    return await query.orderBy('createdAt', 'desc')
  }

  /**
   * Realiza o reembolso de uma transação
   */
  public async refund(transactionId: number) {
    const transaction = await Transaction.query()
      .where('id', transactionId)
      .preload('gateway')
      .firstOrFail()

    if (transaction.status === 'REFUNDED') {
      throw new Error('Esta transação já foi reembolsada.')
    }

    if (transaction.status !== 'APPROVED') {
      throw new Error('Apenas transações aprovadas podem ser reembolsadas.')
    }

    // Chama o gateway responsável pelo pagamento original para processar o estorno
    const response = await this.gatewayService.chargeback(
      transaction.gateway.name,
      transaction.externalId
    )

    if (response.status === 'REFUNDED') {
      transaction.status = 'REFUNDED'
      await transaction.save()
    }

    return transaction
  }

  /**
   * Processa a transação de pagamento e persiste os dados no banco
   */
  public async processPayment(payload: {

    client_name: string
    client_email: string
    products: { id: number; quantity: number }[]
    card_number: string
    cvv: string
    card_expiration_date: string
    card_holder_name: string
  }) {
    const trx = await db.transaction()

    try {
      // Busca ou cria o cliente pelo e-mail
      const client = await Client.firstOrCreate(
        { email: payload.client_email },
        { name: payload.client_name },
        { client: trx }
      )

      let totalAmount = 0
      const productRecords: { product: Product; quantity: number }[] = []

      // Busca os produtos e calcula o valor total no back-end (Nível 3)
      for (const p of payload.products) {
        const product = await Product.findOrFail(p.id, { client: trx })
        totalAmount += product.amount * p.quantity
        productRecords.push({ product, quantity: p.quantity })
      }

      // Busca gateways ativos ordenados por prioridade (menor número = maior prioridade)
      const activeGateways = await Gateway.query({ client: trx })
        .where('isActive', true)
        .orderBy('priority', 'asc')


      if (activeGateways.length === 0) {
        throw new Error('Nenhum gateway de pagamento ativo configurado.')
      }

      let finalStatus: 'APPROVED' | 'FAILED' = 'FAILED'
      let finalExternalId = ''
      let usedGatewayId: number | null = null

      // Lógica de Fallback: Tenta os gateways em ordem de prioridade
      for (const gateway of activeGateways) {
        const response = await this.gatewayService.processPayment(gateway.name, {
          amount: totalAmount,
          name: payload.client_name,
          email: payload.client_email,
          cardNumber: payload.card_number,
          cvv: payload.cvv,
        })

        if (response.status === 'APPROVED') {
          finalStatus = 'APPROVED'
          finalExternalId = response.externalId
          usedGatewayId = gateway.id
          break // Se aprovou em um, para o fallback
        }

        // Se falhou e for o último gateway, salva o erro dele
        finalExternalId = response.externalId
        usedGatewayId = gateway.id
      }

      // Prepara os dados para salvar a transação.
      // Apenas os últimos 4 dígitos do cartão são armazenados por segurança.
      const cardLastNumbers = payload.card_number.slice(-4)

      const transaction = await Transaction.create(
        {
          clientId: client.id,
          gatewayId: usedGatewayId!,
          amount: totalAmount,
          cardLastNumbers: cardLastNumbers,
          status: finalStatus,
          externalId: finalExternalId,
        },
        { client: trx }
      )

      // Vincula a transação aos produtos na tabela pivô
      for (const record of productRecords) {
        await TransactionProduct.create(
          {
            transactionId: transaction.id,
            productId: record.product.id,
            quantity: record.quantity,
          },
          { client: trx }
        )
      }

      // Carrega os dados do cliente antes de finalizar a transação do banco
      await transaction.load('client')

      // Confirma todas as operações no banco de dados
      await trx.commit()

      return transaction
      
    } catch (error) {
      // Reverte as alterações em caso de falha em qualquer etapa
      await trx.rollback()
      throw error
    }
  }
}
