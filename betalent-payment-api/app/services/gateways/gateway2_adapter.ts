import env from '#start/env'
import { GatewayAdapter, PaymentResponse } from './gateway_adapter.js'

/**
 * Adapter para o Gateway 2 (Porta 3002)
 */
export default class Gateway2Adapter implements GatewayAdapter {
  private baseUrl = env.get('GATEWAY_2_URL', 'http://betalent-gateways-mock:3002')

  public async processPayment(data: {
    amount: number
    name: string
    email: string
    cardNumber: string
    cvv: string
  }): Promise<PaymentResponse> {
    try {
      const token = env.get('GATEWAY_2_TOKEN')
      const secret = env.get('GATEWAY_2_SECRET')

      const response = await fetch(`${this.baseUrl}/transacoes`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          
          'Gateway-Auth-Token': token || '',
          'Gateway-Auth-Secret': secret || '',
        },
        body: JSON.stringify({
          valor: data.amount,
          nome: data.name,
          email: data.email,
          numeroCartao: data.cardNumber,
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
      console.error(`[Gateway 2 Error] URL: ${this.baseUrl}/transacoes | Error:`, error.message)
      return {
        status: 'FAILED',
        externalId: `exception_${Date.now()}`,
      }
    }
  }

  public async chargeback(externalId: string): Promise<{ status: 'REFUNDED' | 'FAILED' }> {
    try {
      const token = env.get('GATEWAY_2_TOKEN')
      const secret = env.get('GATEWAY_2_SECRET')

      const response = await fetch(`${this.baseUrl}/transacoes/reembolso`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Gateway-Auth-Token': token || '',
          'Gateway-Auth-Secret': secret || '',
        },
        body: JSON.stringify({ id: externalId }),
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
