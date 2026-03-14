import { BaseSeeder } from '@adonisjs/lucid/seeders'
import Product from '#models/product'

export default class extends BaseSeeder {
  async run() {
    // Cria alguns produtos iniciais para teste
    await Product.updateOrCreate(
      { name: 'Produto Exemplo 1' },
      {
        amount: 1000, // R$ 10,00
      }
    )

    await Product.updateOrCreate(
      { name: 'Produto Exemplo 2' },
      {
        amount: 5000, // R$ 50,00
      }
    )

    await Product.updateOrCreate(
      { name: 'Produto Exemplo 3' },
      {
        amount: 9990, // R$ 99,90
      }
    )
  }
}
