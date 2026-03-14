import { test } from '@japa/runner'
import User from '#models/user'

test.group('Auth', () => {
  test('deve realizar login com sucesso e retornar um token', async ({ client }) => {
    // 1. Criar um usuário de teste
    const email = 'test_login@betalent.tech'
    const password = 'password123'
    
    await User.updateOrCreate({ email }, { 
      fullName: 'Test User',
      password,
      role: 'ADMIN'
    })

    // 2. Tentar o login
    const response = await client.post('/api/v1/auth/login').json({
      email,
      password
    })

    // 3. Asserções
    response.assertStatus(200)
    response.assertBodyContains({
      data: {
        token: (t: string) => typeof t === 'string' && t.startsWith('oat_')
      }
    })
  })

  test('deve falhar ao tentar login com credenciais inválidas', async ({ client }) => {
    const response = await client.post('/api/v1/auth/login').json({
      email: 'nonexistent@email.com',
      password: 'wrongpassword'
    })

    response.assertStatus(400) // E_INVALID_CREDENTIALS geralmente mapeia para 400 ou 401 no Handler
  })
})
