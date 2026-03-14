import { test } from '@japa/runner'
import User from '#models/user'
import Transaction from '#models/transaction'
import Gateway from '#models/gateway'
import Client from '#models/client'

test.group('Admin / Protected Routes', () => {
  test('deve listar gateways apenas para usuários autenticados com role ADMIN', async ({ client }) => {
    // 1. Criar usuário ADMIN
    const admin = await User.create({
      fullName: 'Admin User',
      email: `admin_${Date.now()}@test.com`,
      password: 'password123',
      role: 'ADMIN'
    })

    // 2. Criar usuário USER (sem permissão)
    const commonUser = await User.create({
      fullName: 'Common User',
      email: `user_${Date.now()}@test.com`,
      password: 'password123',
      role: 'USER'
    })

    // 3. Tentar acessar com ADMIN (Sucesso)
    const responseAdmin = await client
      .get('/api/v1/gateways')
      .loginAs(admin)
    
    responseAdmin.assertStatus(200)

    // 4. Tentar acessar com USER (Falha - Forbidden)
    const responseUser = await client
      .get('/api/v1/gateways')
      .loginAs(commonUser)
    
    responseUser.assertStatus(403)
  })

  test('deve realizar o reembolso de uma transação aprovada', async ({ client }) => {
    // 1. Setup: Criar Admin, Gateway, Cliente e Transação Aprovada
    const admin = await User.create({
      fullName: 'Admin Refund',
      email: `admin_refund_${Date.now()}@test.com`,
      password: 'password123',
      role: 'ADMIN'
    })

    const gateway = await Gateway.updateOrCreate({ name: 'Gateway 1' }, { isActive: true, priority: 1 })
    const dbClient = await Client.create({ name: 'Client Refund', email: `client_refund_${Date.now()}@test.com` })
    
    const transaction = await Transaction.create({
      clientId: dbClient.id,
      gatewayId: gateway.id,
      amount: 5000,
      status: 'APPROVED',
      externalId: 'ext_test_123',
      cardLastNumbers: '1234'
    })

    // 2. Executar Reembolso
    const response = await client
      .post(`/api/v1/transactions/${transaction.id}/refund`)
      .loginAs(admin)

    // 3. Asserções
    response.assertStatus(200)
    response.assertBodyContains({
      data: {
        status: 'REFUNDED'
      }
    })
  })
})
