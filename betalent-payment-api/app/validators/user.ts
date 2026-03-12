import vine from '@vinejs/vine'

/**
 * Regras comuns para campos de e-mail e senha
 */
const email = () => vine.string().email().maxLength(254)
const password = () => vine.string().minLength(8).maxLength(32)

/**
 * Validador para o cadastro de novos usuários
 */
export const signupValidator = vine.create({
  fullName: vine.string().nullable(),
  email: email().unique({ table: 'users', column: 'email' }),
  password: password(),
  passwordConfirmation: password().sameAs('password'),
})

/**
 * Validador para autenticação de usuários (login)
 */
export const loginValidator = vine.create({
  email: email(),
  password: vine.string(),
})
