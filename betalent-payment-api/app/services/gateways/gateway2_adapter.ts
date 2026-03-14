import { GatewayAdapter, PaymentResponse } from './gateway_adapter.js'

/**
 * Adapter para o Gateway 2 (Porta 3002)
 */
export default class Gateway2Adapter implements GatewayAdapter {
  private baseUrl = 'http://localhost:3002'

  public async processPayment(data: {
    amount: number
    name: string
    email: string
    cardNumber: string
    cvv: string
  }): Promise<PaymentResponse> {
    try {
      const response = await fetch(`${this.baseUrl}/transacoes`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          // Header conforme teste.md para Gateway 2
          'Gateway-Auth-Token': 'tk_f2198cc671b5289fa856',
          'Gateway-Auth-Secret': '3d15e8ed6131446ea7e3456728b1211f',
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
    } catch (error) {
      return {
        status: 'FAILED',
        externalId: `exception_${Date.now()}`,
      }
    }
  }

  public async chargeback(externalId: string): Promise<{ status: 'REFUNDED' | 'FAILED' }> {
    try {
      const response = await fetch(`${this.baseUrl}/transacoes/reembolso`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Gateway-Auth-Token': 'tk_f2198cc671b5289fa856',
          'Gateway-Auth-Secret': '3d15e8ed6131446ea7e3456728b1211f',
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
