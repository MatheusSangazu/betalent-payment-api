import Product from '#models/product'

/**
 * Serviço responsável pela gestão de produtos
 */
export default class ProductService {
  /**
   * Lista todos os produtos
   */
  public async all() {
    return await Product.all()
  }

  /**
   * Busca um produto por ID
   */
  public async find(id: number) {
    return await Product.findOrFail(id)
  }

  /**
   * Cria um novo produto
   */
  public async create(data: { name: string; amount: number }) {
    return await Product.create(data)
  }

  /**
   * Atualiza um produto existente
   */
  public async update(id: number, data: { name?: string; amount?: number }) {
    const product = await Product.findOrFail(id)
    product.merge(data)
    await product.save()
    return product
  }

  /**
   * Remove um produto
   */
  public async delete(id: number) {
    const product = await Product.findOrFail(id)
    await product.delete()
  }
}
