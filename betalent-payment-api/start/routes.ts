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
const AccessTokenController = () => import('#controllers/access_token_controller')
const ProfileController = () => import('#controllers/profile_controller')

router
  .group(() => {
    // Auth Routes
    router.post('auth/login', [AccessTokenController, 'store'])
    router.post('auth/logout', [AccessTokenController, 'destroy']).use(middleware.auth())
    router.get('auth/me', [ProfileController, 'show']).use(middleware.auth())

    // Transactions
    router.get('transactions', [TransactionController, 'index'])
    router.post('transactions', [TransactionController, 'store'])
    router.post('transactions/:id/refund', [TransactionController, 'refund']).use([
      middleware.auth(),
      middleware.role(['ADMIN', 'FINANCE']),
    ])

    // Gateways
    router.group(() => {
      router.get('gateways', [GatewaysController, 'index'])
      router.patch('gateways/:id', [GatewaysController, 'update'])
    }).use([middleware.auth(), middleware.role(['ADMIN'])])

    // Products
    router.group(() => {
      router.get('products', [ProductsController, 'index'])
      router.get('products/:id', [ProductsController, 'show'])
      router.post('products', [ProductsController, 'store'])
      router.patch('products/:id', [ProductsController, 'update'])
      router.delete('products/:id', [ProductsController, 'destroy'])
    }).use([middleware.auth(), middleware.role(['ADMIN', 'MANAGER', 'FINANCE'])])

    // Users
    router.group(() => {
      router.get('users', [UsersController, 'index'])
      router.get('users/:id', [UsersController, 'show'])
      router.post('users', [UsersController, 'store'])
      router.patch('users/:id', [UsersController, 'update'])
      router.delete('users/:id', [UsersController, 'destroy'])
    }).use([middleware.auth(), middleware.role(['ADMIN', 'MANAGER'])])

    // Clients
    router.group(() => {
      router.get('clients', [ClientsController, 'index'])
      router.get('clients/:id', [ClientsController, 'show'])
    }).use([middleware.auth(), middleware.role(['ADMIN', 'MANAGER', 'FINANCE'])])
  })
  .prefix('api/v1')
