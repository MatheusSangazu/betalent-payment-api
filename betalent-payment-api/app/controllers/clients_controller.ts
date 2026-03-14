import type { HttpContext } from '@adonisjs/core/http'
import ClientService from '#services/client_service'
import { inject } from '@adonisjs/core'

@inject()
export default class ClientsController {
  constructor(protected clientService: ClientService) {}

  /**
   * Lista todos os clientes
   */
  public async index({ response }: HttpContext) {
    const clients = await this.clientService.all()
    return response.ok(clients)
  }

  /**
   * Detalhe do cliente e todas suas compras
   */
  public async show({ params, response }: HttpContext) {
    const client = await this.clientService.findWithTransactions(params.id)
    return response.ok(client)
  }
}
