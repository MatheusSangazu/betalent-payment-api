import { test } from '@japa/runner'
import Product from '#models/product'
import Gateway from '#models/gateway'

test.group('Transactions', () => {
  test('deve criar uma transação com sucesso através do fallback', async ({ client }) => {
    // 1. Garantir que existam produtos e gateways ativos no banco
    const product = await Product.create({ name: 'Produto Teste', amount: 1000 })
    
    await Gateway.updateOrCreate({ name: 'Gateway 1' }, { isActive: true, priority: 1 })
    await Gateway.updateOrCreate({ name: 'Gateway 2' }, { isActive: true, priority: 2 })

    // 2. Realizar a requisição de compra
    const response = await client.post('/api/v1/transactions').json({
      client_name: 'Teste Japa',
      client_email: 'japa@test.com',
      products: [
        { id: product.id, quantity: 2 }
      ],
      card_number: '1234567812345678',
      cvv: '123',
      card_expiration_date: '12/26',
      card_holder_name: 'JAPA TEST'
    })

    // 3. Asserções
    response.assertStatus(201)
    response.assertBodyContains({
      status: 'APPROVED',
      amount: 2000 // 1000 * 2
    })
  })

  test('deve falhar se não houver gateways ativos', async ({ client }) => {
    await Gateway.query().update({ isActive: false })

    const response = await client.post('/api/v1/transactions').json({
      client_name: 'Teste Falha',
      client_email: 'fail@test.com',
      products: [{ id: 1, quantity: 1 }],
      card_number: '1234567812345678',
      cvv: '123',
      card_expiration_date: '12/26',
      card_holder_name: 'FAIL TEST'
    })

    response.assertStatus(500)
  })
})