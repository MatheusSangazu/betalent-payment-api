import { assert } from '@japa/assert'
import { apiClient } from '@japa/api-client'
import app from '@adonisjs/core/services/app'
import type { Config } from '@japa/runner/types'
import { pluginAdonisJS } from '@japa/plugin-adonisjs'
import testUtils from '@adonisjs/core/services/test_utils'
import { authApiClient } from '@adonisjs/auth/plugins/api_client'
import { sessionApiClient } from '@adonisjs/session/plugins/api_client'
import type { Registry } from '../.adonisjs/client/registry/schema.d.ts'
import db from '@adonisjs/lucid/services/db'

declare module '@japa/api-client/types' {
  interface RoutesRegistry extends Registry {}
}

export const plugins: Config['plugins'] = [
  assert(),
  pluginAdonisJS(app),
  apiClient(),
  sessionApiClient(app),
  authApiClient(app),
]


export const runnerHooks: Required<Pick<Config, 'setup' | 'teardown'>> = {
  setup: [
    () => testUtils.db().migrate(),
  ],
  teardown: [() => app.terminate(),],
}


export const configureSuite: Config['configureSuite'] = (suite) => {
  if (['browser', 'functional', 'e2e'].includes(suite.name)) {
    suite.setup( () => {
      // Força a porta no ambiente antes de subir o servidor para evitar conflitos
      process.env.PORT = '3334'
      return testUtils.httpServer().start()
    })
    
    suite.onTest((test) => {
      // Inicia a transação APENAS quando o teste for rodar de fato
      test.setup(async () => {
        await db.beginGlobalTransaction()
      })
      
      // Limpa a sujeira do banco após o teste terminar
      test.cleanup(async () => {
        await db.rollbackGlobalTransaction()
      })
    })
  }
}
