import { BaseSeeder } from '@adonisjs/lucid/seeders'
import User from '#models/user'

export default class extends BaseSeeder {
  async run() {
    // Cria ou atualiza o usuário administrador inicial
    await User.updateOrCreate(
      { email: 'admin@betalent.tech' },
      {
        fullName: 'Administrador BeTalent',
        password: 'admin_password_123', // Lucid hash mixin cuidará do hashing automaticamente no create/save
        role: 'ADMIN',
      }
    )
  }
}
