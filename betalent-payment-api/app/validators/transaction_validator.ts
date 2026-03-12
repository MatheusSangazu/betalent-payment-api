import vine from '@vinejs/vine'

/**
 * Validador para a criação de uma nova transação
 */
export const createTransactionValidator = vine.create({
  // Valor da transação (deve ser positivo)
  amount: vine.number().positive(),
  
  // Dados do cliente
  client_name: vine.string(),
  client_email: vine.string().email(),
  
  // Identificação do produto
  product_id: vine.number(),
  
  // Dados do cartão de crédito
  card_number: vine.string().minLength(13).maxLength(19),
  cvv: vine.string().minLength(3).maxLength(4),
  card_expiration_date: vine.string().regex(/^(0[1-9]|1[0-2])\/([0-9]{2})$/),
  card_holder_name: vine.string(),
})