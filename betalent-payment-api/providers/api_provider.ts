import { HttpContext } from '@adonisjs/core/http'

/**
 * Custom serialize function that ensures all responses are wrapped in a 'data' property.
 */
function serialize(data: any) {
  // If data is already wrapped or null/undefined, return as is
  if (data === null || data === undefined || (typeof data === 'object' && 'data' in data)) {
    return data
  }

  // If it's a Lucid model, convert to JSON first
  const plainData = typeof data.toJSON === 'function' ? data.toJSON() : data

  return {
    data: plainData,
  }
}

/**
 * Adds the serialize method to all HttpContext instances.
 * Usage in controllers: return ctx.serialize(data)
 * This ensures all API responses follow the same structure with data wrapping.
 */
HttpContext.instanceProperty('serialize', serialize)

/**
 * Module augmentation to add the serialize method to HttpContext.
 * This allows controllers to use ctx.serialize() for consistent API responses.
 */
declare module '@adonisjs/core/http' {
  export interface HttpContext {
    serialize: typeof serialize
  }
}
