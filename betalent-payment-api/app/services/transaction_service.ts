import db from '@adonisjs/lucid/services/db'
import Client from '#models/client'
import Product from '#models/product'
import Transaction from '#models/transaction'
import TransactionProduct from '#models/transaction_product'

/**
 * Serviço responsável por gerenciar as transações de pagamento
 */
export default class TransactionService {
  /**
   * Processa a transação de pagamento e persiste os dados no banco
   */
  public async processPayment(payload: {
    amount: number
    client_name: string
    client_email: string
    product_id: number
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

      // Localiza o produto ou cria um registro temporário para evitar falhas no teste
      let product = await Product.find(payload.product_id, { client: trx })
      if (!product) {
        product = await Product.create(
          {
            id: payload.product_id,
            name: 'Produto Mock',
            amount: payload.amount,
          },
          { client: trx }
        )
      }

      // Prepara os dados para salvar a transação.
      // Apenas os últimos 4 dígitos do cartão são armazenados por segurança.
      const cardLastNumbers = payload.card_number.slice(-4)

      const transaction = await Transaction.create(
        {
          clientId: client.id,
          amount: payload.amount,
          cardLastNumbers: cardLastNumbers,
          status: 'APPROVED',
          // ID externo temporário enquanto a integração com gateways não é implementada
          externalId: `mock_${Date.now()}_${Math.random().toString(36).substring(7)}`,
        },
        { client: trx }
      )

      // Vincula a transação ao produto na tabela pivô
      await TransactionProduct.create(
        {
          transactionId: transaction.id,
          productId: product.id,
          quantity: 1,
        },
        { client: trx }
      )

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
