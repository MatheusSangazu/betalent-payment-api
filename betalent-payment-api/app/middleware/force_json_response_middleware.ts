import type { HttpContext } from '@adonisjs/core/http'
import type { NextFn } from '@adonisjs/core/types/http'

/**
 * Middleware para forçar o cabeçalho Accept como application/json em todas as requisições
 */
export default class ForceJsonResponseMiddleware {
  handle(ctx: HttpContext, next: NextFn) {
    // Define o cabeçalho Accept para garantir que as respostas sejam em formato JSON
    ctx.request.request.headers.accept = 'application/json'
    return next()
  }
}
