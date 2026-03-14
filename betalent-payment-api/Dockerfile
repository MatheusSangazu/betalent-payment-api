FROM node:24-alpine AS base

# All build steps require libc6-compat
RUN apk add --no-cache libc6-compat

# Step 1: Install dependencies
FROM base AS deps
WORKDIR /app
COPY package.json package-lock.json ./
RUN npm ci

# Step 2: Build the application
FROM base AS build
WORKDIR /app
COPY --from=deps /app/node_modules ./node_modules
COPY . .
# Ignora erros de TypeScript durante o build conforme sugerido pelo adonis
RUN node ace build --ignore-ts-errors

# Step 3: Production stage
FROM base AS production
WORKDIR /app
ENV NODE_ENV=production
COPY --from=build /app/build ./build
COPY --from=build /app/package.json ./package.json
COPY --from=build /app/package-lock.json ./package-lock.json
# Adiciona o arquivo ace para permitir comandos de CLI no container
COPY --from=build /app/ace.js ./ace.js
RUN npm ci --omit=dev

EXPOSE 3333
CMD ["node", "build/bin/server.js"]
