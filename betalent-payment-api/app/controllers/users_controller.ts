import type { HttpContext } from '@adonisjs/core/http'
import UserService from '#services/user_service'
import { inject } from '@adonisjs/core'
import vine from '@vinejs/vine'

@inject()
export default class UsersController {
  constructor(protected userService: UserService) {}

  /**
   * Lista todos os usuários
   */
  public async index({ serialize }: HttpContext) {
    const users = await this.userService.all()
    return serialize(users)
  }

  /**
   * Busca um usuário por ID
   */
  public async show({ params, serialize }: HttpContext) {
    const user = await this.userService.find(params.id)
    return serialize(user)
  }

  /**
   * Cria um novo usuário
   */
  public async store({ request, response, serialize }: HttpContext) {
    const schema = vine.create(
      vine.object({
        fullName: vine.string().nullable().optional(),
        email: vine.string().email().unique({ table: 'users', column: 'email' }),
        password: vine.string().minLength(8),
        role: vine.enum(['ADMIN', 'MANAGER', 'FINANCE', 'USER']),
      })
    )

    const payload = await request.validateUsing(schema)
    const user = await this.userService.create(payload)

    return response.created(serialize(user))
  }

  /**
   * Atualiza um usuário existente
   */
  public async update({ params, request, serialize }: HttpContext) {
    const schema = vine.create(
      vine.object({
        fullName: vine.string().trim().nullable().optional(),
        email: vine
          .string()
          .trim()
          .email()
          .unique(async (db, value) => {
            const user = await db
              .from('users')
              .where('email', value)
              .whereNot('id', params.id)
              .first()
            return !user
          })
          .optional(),
        password: vine.string().minLength(8).optional(),
        role: vine.enum(['ADMIN', 'MANAGER', 'FINANCE', 'USER']).optional(),
      })
    )

    const payload = await request.validateUsing(schema)
    const user = await this.userService.update(params.id, payload)

    return serialize(user)
  }

  /**
   * Remove um usuário
   */
  public async destroy({ params, response }: HttpContext) {
    await this.userService.delete(params.id)
    return response.noContent()
  }
}
