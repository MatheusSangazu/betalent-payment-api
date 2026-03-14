import Client from '#models/client'

/**
 * Serviço responsável pela gestão de clientes
 */
export default class ClientService {
  /**
   * Lista todos os clientes
   */
  public async all() {
    return await Client.all()
  }

  /**
   * Busca um cliente por ID com seu histórico de compras (transações)
   */
  public async findWithTransactions(id: number) {
    return await Client.query()
      .where('id', id)
      .preload('transactions', (transactionQuery) => {
        transactionQuery.preload('transactionProducts', (tpQuery) => {
          tpQuery.preload('product')
        })
      })
      .firstOrFail()
  }
}
