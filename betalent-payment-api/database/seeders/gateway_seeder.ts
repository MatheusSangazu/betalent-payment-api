import { BaseSeeder } from '@adonisjs/lucid/seeders'
import Gateway from '#models/gateway'

export default class extends BaseSeeder {
  async run() {
    // Cria ou atualiza os gateways iniciais
    await Gateway.updateOrCreate(
      { name: 'Gateway 1' },
      {
        isActive: true,
        priority: 1,
      }
    )

    await Gateway.updateOrCreate(
      { name: 'Gateway 2' },
      {
        isActive: true,
        priority: 2,
      }
    )
  }
}
