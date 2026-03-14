import type { HttpContext } from '@adonisjs/core/http'
import Gateway from '#models/gateway'
import vine from '@vinejs/vine'

export default class GatewaysController {
  /**
   * Lista todos os gateways cadastrados
   */
  public async index({ serialize }: HttpContext) {
    const gateways = await Gateway.query().orderBy('priority', 'asc')
    return serialize(gateways)
  }

  /**
   * Atualiza o status de ativação ou a prioridade de um gateway
   */
  public async update({ params, request, serialize }: HttpContext) {
    const gateway = await Gateway.findOrFail(params.id)

    const schema = vine.create(
      vine.object({
        isActive: vine.boolean().optional(),
        priority: vine.number().positive().optional(),
      })
    )

    const payload = await request.validateUsing(schema)

    gateway.merge(payload)
    await gateway.save()

    return serialize(gateway)
  }
}
