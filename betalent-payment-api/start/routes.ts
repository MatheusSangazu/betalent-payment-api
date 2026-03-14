/*
|--------------------------------------------------------------------------
| Routes file
|--------------------------------------------------------------------------
*/

import { middleware } from '#start/kernel'
import router from '@adonisjs/core/services/router'
import { controllers } from '#generated/controllers'

router.get('/', () => {
  return { hello: 'world' }
})

const TransactionController = () => import('#controllers/transaction_controller')
const GatewaysController = () => import('#controllers/gateways_controller')
const ProductsController = () => import('#controllers/products_controller')
const UsersController = () => import('#controllers/users_controller')
const ClientsController = () => import('#controllers/clients_controller')

router.group(() => {
  router.get('transactions', [TransactionController, 'index'])
  router.post('transactions', [TransactionController, 'store'])

  // Rotas de Gestão de Gateways (Privadas - ADMIN apenas)
  router.group(() => {
    router.get('gateways', [GatewaysController, 'index'])
    router.patch('gateways/:id', [GatewaysController, 'update'])
  }).use([
    middleware.auth(),
    middleware.role(['ADMIN'])
  ])

  // Rotas de Gestão de Produtos (Privadas - ADMIN, MANAGER, FINANCE)
  router.group(() => {
    router.get('products', [ProductsController, 'index'])
    router.get('products/:id', [ProductsController, 'show'])
    router.post('products', [ProductsController, 'store'])
    router.patch('products/:id', [ProductsController, 'update'])
    router.delete('products/:id', [ProductsController, 'destroy'])
  }).use([
    middleware.auth(),
    middleware.role(['ADMIN', 'MANAGER', 'FINANCE'])
  ])

  // Rotas de Gestão de Usuários (Privadas - ADMIN, MANAGER)
  router.group(() => {
    router.get('users', [UsersController, 'index'])
    router.get('users/:id', [UsersController, 'show'])
    router.post('users', [UsersController, 'store'])
    router.patch('users/:id', [UsersController, 'update'])
    router.delete('users/:id', [UsersController, 'destroy'])
  }).use([
    middleware.auth(),
    middleware.role(['ADMIN', 'MANAGER'])
  ])

  // Rotas de Clientes (Privadas - ADMIN, MANAGER, FINANCE)
  router.group(() => {
    router.get('clients', [ClientsController, 'index'])
    router.get('clients/:id', [ClientsController, 'show'])
  }).use([
    middleware.auth(),
    middleware.role(['ADMIN', 'MANAGER', 'FINANCE'])
  ])
}).prefix('api')

router
  .group(() => {
    router
      .group(() => {
        router.post('signup', [controllers.NewAccount, 'store'])
        router.post('login', [controllers.AccessToken, 'store'])
        router.post('logout', [controllers.AccessToken, 'destroy']).use(middleware.auth())
      })
      .prefix('auth')
      .as('auth')

    router
      .group(() => {
        router.get('/profile', [controllers.Profile, 'show'])
      })
      .prefix('account')
      .as('profile')
      .use(middleware.auth())
  })
  .prefix('/api/v1')
