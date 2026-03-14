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
