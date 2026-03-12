import vine from '@vinejs/vine'

/**
 * Valida a solicitação de criação da transação
 */
export const createTransactionValidator = vine.create({
  amount: vine.number().positive(),
  client_name: vine.string(),
  client_email: vine.string().email(),
  product_id: vine.number(),
  card_number: vine.string().minLength(13).maxLength(19),
  cvv: vine.string().minLength(3).maxLength(4),
  card_expiration_date: vine.string().regex(/^(0[1-9]|1[0-2])\/([0-9]{2})$/),
  card_holder_name: vine.string(),
})