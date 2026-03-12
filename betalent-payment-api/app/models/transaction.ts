import { DateTime } from 'luxon'
import { BaseModel, column, belongsTo, hasMany } from '@adonisjs/lucid/orm'
import type { BelongsTo, HasMany } from '@adonisjs/lucid/types/relations'
import Client from '#models/client'
import Gateway from '#models/gateway'
import TransactionProduct from '#models/transaction_product'

/**
 * Modelo representativo das transações de pagamento
 */
export default class Transaction extends BaseModel {
  @column({ isPrimary: true })
  declare id: number

  @column()
  declare clientId: number

  @column()
  declare gatewayId: number

  @column()
  declare externalId: string

  @column()
  declare status: string

  @column()
  declare amount: number

  @column()
  declare cardLastNumbers: string

  @column.dateTime({ autoCreate: true })
  declare createdAt: DateTime

  @column.dateTime({ autoCreate: true, autoUpdate: true })
  declare updatedAt: DateTime

  /**
   * Relacionamento: Uma transação pertence a um cliente
   */
  @belongsTo(() => Client)
  declare client: BelongsTo<typeof Client>

  /**
   * Relacionamento: Uma transação é processada por um gateway
   */
  @belongsTo(() => Gateway)
  declare gateway: BelongsTo<typeof Gateway>

  /**
   * Relacionamento: Uma transação possui vários produtos vinculados através da tabela pivô
   */
  @hasMany(() => TransactionProduct)
  declare transactionProducts: HasMany<typeof TransactionProduct>
}