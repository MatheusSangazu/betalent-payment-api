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
  public async index({ serialize }: HttpContext) {
    const products = await this.productService.all()
    return serialize(products)
  }

  /**
   * Busca um produto por ID
   */
  public async show({ params, serialize }: HttpContext) {
    const product = await this.productService.find(params.id)
    return serialize(product)
  }

  /**
   * Cria um novo produto
   */
  public async store({ request, response, serialize }: HttpContext) {
    const schema = vine.create(
      vine.object({
        name: vine.string(),
        amount: vine.number().positive(),
      })
    )

    const payload = await request.validateUsing(schema)
    const product = await this.productService.create(payload)

    return response.created(serialize(product))
  }

  /**
   * Atualiza um produto existente
   */
  public async update({ params, request, serialize }: HttpContext) {
    const schema = vine.create(
      vine.object({
        name: vine.string().optional(),
        amount: vine.number().positive().optional(),
      })
    )

    const payload = await request.validateUsing(schema)
    const product = await this.productService.update(params.id, payload)

    return serialize(product)
  }

  /**
   * Remove um produto
   */
  public async destroy({ params, response }: HttpContext) {
    await this.productService.delete(params.id)
    return response.noContent()
  }
}
