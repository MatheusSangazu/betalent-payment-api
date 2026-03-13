import { GatewayAdapter, PaymentResponse } from './gateway_adapter.js'

/**
 * Adapter para o Gateway 1 (Porta 3001)
 */
export default class Gateway1Adapter implements GatewayAdapter {
  private baseUrl = 'http://localhost:3001'

  public async processPayment(data: {
    amount: number
    name: string
    email: string
    cardNumber: string
    cvv: string
  }): Promise<PaymentResponse> {
    try {
      const response = await fetch(`${this.baseUrl}/transactions`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          // O teste menciona REMOVE_AUTH='true' para simplificar o Nível 1/2
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
    } catch (error) {
      return {
        status: 'FAILED',
        externalId: `exception_${Date.now()}`,
      }
    }
  }
}
