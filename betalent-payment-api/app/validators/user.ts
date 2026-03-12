import vine from '@vinejs/vine'

/**
 * Regras compartilhadas para e-mail e senha.
 */
const email = () => vine.string().email().maxLength(254)
const password = () => vine.string().minLength(8).maxLength(32)

/**
 * Validador a ser usado ao realizar o auto-cadastro
 */
export const signupValidator = vine.create({
  fullName: vine.string().nullable(),
  email: email().unique({ table: 'users', column: 'email' }),
  password: password(),
  passwordConfirmation: password().sameAs('password'),
})

/**
 * Validador a ser usado antes de validar as credenciais do usuário
 * durante o login.
 */
export const loginValidator = vine.create({
  email: email(),
  password: vine.string(),
})
