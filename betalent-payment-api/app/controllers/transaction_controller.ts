import type { HttpContext } from '@adonisjs/core/http'
import { createTransactionValidator } from '#validators/transaction_validator'
import TransactionService from '#services/transaction_service'
import { inject } from '@adonisjs/core'

@inject()
export default class TransactionController {
  constructor(protected transactionService: TransactionService) {}

  /**
   * Lista as transações com filtros
   */
  public async index({ request, response }: HttpContext) {
    const filters = request.qs()
    const transactions = await this.transactionService.getAllTransactions(filters)
    return response.ok(transactions)
  }

  /**
   * Registra uma nova transação
   */
  public async store({ request, response }: HttpContext) {
    // Valida os dados da requisição conforme o schema do VineJS
    const payload = await request.validateUsing(createTransactionValidator)

    // Processa o pagamento através da camada de serviço
    const transaction = await this.transactionService.processPayment(payload)

    return response.created(transaction)
  }
}