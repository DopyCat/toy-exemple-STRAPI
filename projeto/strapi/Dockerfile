FROM node:20-bullseye-slim AS deps
WORKDIR /srv/app
COPY package.json package-lock.json* ./
RUN npm ci --silent

FROM node:20-bullseye-slim AS builder
WORKDIR /srv/app
COPY --from=deps /srv/app/node_modules ./node_modules
COPY . .
RUN npm run build

FROM node:20-bullseye-slim AS runner
WORKDIR /srv/app
ENV NODE_ENV=production
COPY --from=builder /srv/app .
RUN npm prune --production --silent || true
EXPOSE 1337
CMD ["npm","run","start"]
