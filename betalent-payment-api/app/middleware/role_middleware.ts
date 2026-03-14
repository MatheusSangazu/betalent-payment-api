import type { HttpContext } from '@adonisjs/core/http'
import type { NextFn } from '@adonisjs/core/types/http'

/**
 * Middleware para validar a role do usuário autenticado
 */
export default class RoleMiddleware {
  /**
   * O método handle verifica se o usuário possui um dos papéis permitidos
   */
  async handle(ctx: HttpContext, next: NextFn, allowedRoles: string[]) {
    // Recupera o usuário autenticado. Falha caso não exista
    const user = ctx.auth.getUserOrFail()

    // Verifica se a role do usuário está na lista de roles permitidas para a rota
    if (!allowedRoles.includes(user.role)) {
      return ctx.response.forbidden({
        message: 'Acesso negado: você não tem permissão para acessar este recurso.',
      })
    }

    return next()
  }
}
