/* eslint-disable prettier/prettier */
import type { routes } from './index.ts'

export interface ApiDefinition {
  transaction: {
    index: typeof routes['transaction.index']
    store: typeof routes['transaction.store']
  }
  auth: {
    newAccount: {
      store: typeof routes['auth.new_account.store']
    }
    accessToken: {
      store: typeof routes['auth.access_token.store']
      destroy: typeof routes['auth.access_token.destroy']
    }
  }
  profile: {
    profile: {
      show: typeof routes['profile.profile.show']
    }
  }
}
