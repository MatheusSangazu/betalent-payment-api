import Gateway1Adapter from './gateways/gateway1_adapter.js'
import Gateway2Adapter from './gateways/gateway2_adapter.js'
import { GatewayAdapter, PaymentResponse } from './gateways/gateway_adapter.js'

/**
 * Serviço que gerencia a comunicação com os diversos gateways de pagamento
 */
export default class GatewayService {
  private adapters: Record<string, GatewayAdapter> = {
    'Gateway 1': new Gateway1Adapter(),
    'Gateway 2': new Gateway2Adapter(),
  }

  /**
   * Tenta processar o pagamento em um gateway específico
   */
  public async processPayment(
    gatewayName: string,
    data: {
      amount: number
      name: string
      email: string
      cardNumber: string
      cvv: string
    }
  ): Promise<PaymentResponse> {
    const adapter = this.adapters[gatewayName]

    if (!adapter) {
      return {
        status: 'FAILED',
        externalId: `error_gateway_not_found_${Date.now()}`,
      }
    }

    return await adapter.processPayment(data)
  }

  /**
   * Realiza o estorno (chargeback) em um gateway específico
   */
  public async chargeback(gatewayName: string, externalId: string) {
    const adapter = this.adapters[gatewayName]

    if (!adapter) {
      throw new Error(`Adapter para o gateway "${gatewayName}" não encontrado.`)
    }

    return await adapter.chargeback(externalId)
  }
}
