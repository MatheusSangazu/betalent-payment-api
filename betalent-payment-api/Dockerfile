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

# Copiar todo o código fonte para permitir a execução de testes (TDD)
COPY . .

# Copiar também o build compilado
COPY --from=build /app/build ./build

# Instalar todas as dependências (incluindo devDeps) para permitir rodar testes via Docker
# Rodamos antes de definir NODE_ENV=production para garantir que devDeps sejam instaladas
RUN npm ci

ENV NODE_ENV=production
EXPOSE 3333
CMD ["node", "build/bin/server.js"]
