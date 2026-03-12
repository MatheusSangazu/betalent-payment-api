import { Logger } from '@adonisjs/core/logger'
import { HttpContext } from '@adonisjs/core/http'
import { type NextFn } from '@adonisjs/core/types/http'

/**
 * O middleware de vinculação do container associa classes aos seus valores
 * específicos de requisição através do resolvedor do container.
 *
 * - Vincula a classe "HttpContext" ao objeto "ctx"
 * - Vincula a classe "Logger" ao objeto "ctx.logger"
 */
export default class ContainerBindingsMiddleware {
  handle(ctx: HttpContext, next: NextFn) {
    ctx.containerResolver.bindValue(HttpContext, ctx)
    ctx.containerResolver.bindValue(Logger, ctx.logger)

    return next()
  }
}
