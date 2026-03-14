import type { HttpContext } from '@adonisjs/core/http'
import ProductService from '#services/product_service'
import { inject } from '@adonisjs/core'
import vine from '@vinejs/vine'

@inject()
export default class ProductsController {
  constructor(protected productService: ProductService) {}

  /**
   * Lista todos os produtos
   */
  public async index({ response }: HttpContext) {
    const products = await this.productService.all()
    return response.ok(products)
  }

  /**
   * Busca um produto por ID
   */
  public async show({ params, response }: HttpContext) {
    const product = await this.productService.find(params.id)
    return response.ok(product)
  }

  /**
   * Cria um novo produto
   */
  public async store({ request, response }: HttpContext) {
    const schema = vine.create(
      vine.object({
        name: vine.string(),
        amount: vine.number().positive(),
      })
    )

    const payload = await request.validateUsing(schema)
    const product = await this.productService.create(payload)

    return response.created(product)
  }

  /**
   * Atualiza um produto existente
   */
  public async update({ params, request, response }: HttpContext) {
    const schema = vine.create(
      vine.object({
        name: vine.string().optional(),
        amount: vine.number().positive().optional(),
      })
    )

    const payload = await request.validateUsing(schema)
    const product = await this.productService.update(params.id, payload)

    return response.ok(product)
  }

  /**
   * Remove um produto
   */
  public async destroy({ params, response }: HttpContext) {
    await this.productService.delete(params.id)
    return response.noContent()
  }
}
