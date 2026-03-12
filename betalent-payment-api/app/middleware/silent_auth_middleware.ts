import type { HttpContext } from '@adonisjs/core/http'
import type { NextFn } from '@adonisjs/core/types/http'

/**
 * O middleware de autenticação silenciosa pode ser usado globalmente para verificar
 * se o usuário está logado sem interromper a requisição.
 *
 * O fluxo continua normalmente mesmo se o usuário não estiver autenticado.
 */
export default class SilentAuthMiddleware {
  async handle(ctx: HttpContext, next: NextFn) {
    await ctx.auth.check()

    return next()
  }
}
