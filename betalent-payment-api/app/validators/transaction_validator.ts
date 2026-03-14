import vine from '@vinejs/vine'

/**
 * Validador para a criação de uma nova transação
 */
export const createTransactionValidator = vine.create({
  // Dados do cliente
  client_name: vine.string().trim(),
  client_email: vine.string().trim().email(),

  // Lista de produtos e suas quantidades 
  products: vine.array(
    vine.object({
      id: vine.number(),
      quantity: vine.number().positive(),
    })
  ).minLength(1),

  // Dados do cartão de crédito
  card_number: vine.string().minLength(13).maxLength(19),
  cvv: vine.string().minLength(3).maxLength(4),
  card_expiration_date: vine.string().regex(/^(0[1-9]|1[0-2])\/([0-9]{2})$/),
  card_holder_name: vine.string().trim(),
})