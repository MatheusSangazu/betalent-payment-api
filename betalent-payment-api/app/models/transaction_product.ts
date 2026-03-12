import { DateTime } from 'luxon'
import { BaseModel, column, belongsTo } from '@adonisjs/lucid/orm'
import type { BelongsTo } from '@adonisjs/lucid/types/relations'
import Transaction from '#models/transaction'
import Product from '#models/product'

/**
 * Modelo representativo da tabela pivô entre Transações e Produtos
 */
export default class TransactionProduct extends BaseModel {
  @column({ isPrimary: true })
  declare id: number

  @column()
  declare transactionId: number

  @column()
  declare productId: number

  @column()
  declare quantity: number

  @column.dateTime({ autoCreate: true })
  declare createdAt: DateTime

  @column.dateTime({ autoCreate: true, autoUpdate: true })
  declare updatedAt: DateTime

  /**
   * Relacionamento: Vincula ao modelo de Transação
   */
  @belongsTo(() => Transaction)
  declare transaction: BelongsTo<typeof Transaction>

  /**
   * Relacionamento: Vincula ao modelo de Produto
   */
  @belongsTo(() => Product)
  declare product: BelongsTo<typeof Product>
}