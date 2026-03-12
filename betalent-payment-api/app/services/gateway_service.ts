import { setTimeout } from 'node:timers/promises'

/**
 * Serviço que simula o Gateway de Pagamento
 */
export default class GatewayService {
  /**
   * Processa o pagamento simulando um delay de rede e aplicando regras de mock
   */
  public async processPayment(amount: number, _cardNumber: string, _cvv: string) {
    // Simula um delay de rede de 1 segundo
    await setTimeout(1000)

    // Gera um ID aleatório para a transação no gateway
    const randomId = Math.random().toString(36).substring(2, 11)

    // Regra de Mock: valores acima de 10.000 são rejeitados
    if (amount > 10000) {
      return {
        status: 'FAILED',
        externalId: `rejeitado_${randomId}`,
      }
    }

    return {
      status: 'APPROVED',
      externalId: `aprovado_${randomId}`,
    }
  }
}
