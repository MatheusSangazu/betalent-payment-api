import env from '#start/env'
import { GatewayAdapter, PaymentResponse } from './gateway_adapter.js'

/**
 * Adapter para o Gateway 1 (Porta 3001)
 */
export default class Gateway1Adapter implements GatewayAdapter {
  private baseUrl = env.get('GATEWAY_1_URL', 'http://betalent-gateways-mock:3001')

  public async processPayment(data: {
    amount: number
    name: string
    email: string
    cardNumber: string
    cvv: string
  }): Promise<PaymentResponse> {
    try {
      // No Gateway 1 real, precisaríamos de uma rota de login para obter o Bearer Token.
      // Para o desafio Nível 3, o mock aceita bypass via REMOVE_AUTH='true' ou token fixo.
      const token = env.get('GATEWAY_1_TOKEN')
      
      const response = await fetch(`${this.baseUrl}/transactions`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({
          amount: data.amount,
          name: data.name,
          email: data.email,
          cardNumber: data.cardNumber,
          cvv: data.cvv,
        }),
      })

      const result = (await response.json()) as any

      if (!response.ok) {
        return {
          status: 'FAILED',
          externalId: result.id || `error_${Date.now()}`,
        }
      }

      return {
        status: 'APPROVED',
        externalId: result.id,
      }
    } catch (error: any) {
      console.error(`[Gateway 1 Error] URL: ${this.baseUrl}/transactions | Error:`, error.message)
      return {
        status: 'FAILED',
        externalId: `exception_${Date.now()}`,
      }
    }
  }

  public async chargeback(externalId: string): Promise<{ status: 'REFUNDED' | 'FAILED' }> {
    try {
      const token = env.get('GATEWAY_1_TOKEN')

      const response = await fetch(`${this.baseUrl}/transactions/${externalId}/charge_back`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
      })

      if (!response.ok) {
        return { status: 'FAILED' }
      }

      return { status: 'REFUNDED' }
    } catch (error) {
      return { status: 'FAILED' }
    }
  }
}
