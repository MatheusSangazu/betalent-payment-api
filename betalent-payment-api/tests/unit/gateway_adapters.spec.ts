import { test } from '@japa/runner'
import Gateway1Adapter from '#services/gateways/gateway1_adapter'
import Gateway2Adapter from '#services/gateways/gateway2_adapter'

test.group('Unit / Gateway Adapters', () => {
  test('Gateway 1 deve formatar corretamente o payload em Inglês', async ({ assert }) => {
    // 1. Setup do mock do fetch global (nativo no Node 18+)
    const originalFetch = global.fetch
    global.fetch = async (url: any, options: any) => {
      const body = JSON.parse(options.body)
      assert.equal(url, 'http://betalent-gateways-mock:3001/transactions')
      assert.exists(body.amount)
      assert.exists(body.cardNumber)
      assert.exists(body.cvv)
      assert.notExists(body.valor) // Não deve ter campos em português
      
      return {
        ok: true,
        json: async () => ({ id: 'gw1_test_123' })
      } as any
    }

    // 2. Executar
    const adapter = new Gateway1Adapter()
    const response = await adapter.processPayment({
      amount: 1000,
      name: 'Tester',
      email: 'test@email.com',
      cardNumber: '1234123412341234',
      cvv: '123'
    })

    // 3. Asserções
    assert.equal(response.status, 'APPROVED')
    assert.equal(response.externalId, 'gw1_test_123')

    // 4. Cleanup
    global.fetch = originalFetch
  })

  test('Gateway 2 deve formatar corretamente o payload em Português', async ({ assert }) => {
    // 1. Setup do mock
    const originalFetch = global.fetch
    global.fetch = async (url: any, options: any) => {
      const body = JSON.parse(options.body)
      assert.equal(url, 'http://betalent-gateways-mock:3002/transacoes')
      assert.exists(body.valor)
      assert.exists(body.numeroCartao)
      assert.exists(body.nome)
      assert.notExists(body.amount) // Não deve ter campos em inglês
      
      return {
        ok: true,
        json: async () => ({ id: 'gw2_test_456' })
      } as any
    }

    // 2. Executar
    const adapter = new Gateway2Adapter()
    const response = await adapter.processPayment({
      amount: 2500,
      name: 'João Silva',
      email: 'joao@email.com',
      cardNumber: '5555444433332222',
      cvv: '999'
    })

    // 3. Asserções
    assert.equal(response.status, 'APPROVED')
    assert.equal(response.externalId, 'gw2_test_456')

    // 4. Cleanup
    global.fetch = originalFetch
  })
})
