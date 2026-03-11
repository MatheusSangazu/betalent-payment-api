import type { HttpContext } from '@adonisjs/core/http'
import { createTransactionValidator } from '#validators/transaction_validator'

export default class TransactionController {
  /**
   * Store a new transaction
   */
  public async store({ request, response }: HttpContext) {
    await request.validateUsing(createTransactionValidator)

    return response.ok({ message: 'Validação passou!' })
  }
}
