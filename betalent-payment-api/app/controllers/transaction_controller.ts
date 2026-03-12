import type { HttpContext } from '@adonisjs/core/http'
import { createTransactionValidator } from '#validators/transaction_validator'

export default class TransactionController {
  async store({ request, response }: HttpContext) {
    
    const payload = await request.validateUsing(createTransactionValidator)

    
    return response.ok({ message: 'Validação passou!', data: payload })
  }
}