export interface PaymentResponse {
  status: 'APPROVED' | 'FAILED'
  externalId: string
}

export interface GatewayAdapter {
  processPayment(data: {
    amount: number
    name: string
    email: string
    cardNumber: string
    cvv: string
  }): Promise<PaymentResponse>
}
