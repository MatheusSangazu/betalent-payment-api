import app from '@adonisjs/core/services/app'
import { type HttpContext, ExceptionHandler } from '@adonisjs/core/http'

export default class HttpExceptionHandler extends ExceptionHandler {
  /**
   * Em modo de depuração, o manipulador de exceções exibirá erros detalhados
   * com rastreamentos de pilha formatados.
   */
  protected debug = !app.inProduction

  /**
   * Método utilizado para manipular erros e retornar a resposta ao cliente
   */
  async handle(error: unknown, ctx: HttpContext) {
    return super.handle(error, ctx)
  }

  /**
   * Método utilizado para reportar erros ao serviço de log ou a um
   * serviço de monitoramento de erros de terceiros.
   *
   * @note Não deve ser enviada uma resposta a partir deste método.
   */
  async report(error: unknown, ctx: HttpContext) {
    return super.report(error, ctx)
  }
}
