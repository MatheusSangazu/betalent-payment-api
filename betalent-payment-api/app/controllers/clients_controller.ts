import type { HttpContext } from '@adonisjs/core/http'
import ClientService from '#services/client_service'
import { inject } from '@adonisjs/core'

@inject()
export default class ClientsController {
  constructor(protected clientService: ClientService) {}

  /**
   * Lista todos os clientes
   */
  public async index({ serialize }: HttpContext) {
    const clients = await this.clientService.all()
    return serialize(clients)
  }

  /**
   * Detalhe do cliente e todas suas compras
   */
  public async show({ params, serialize }: HttpContext) {
    const client = await this.clientService.findWithTransactions(params.id)
    return serialize(client)
  }
}
