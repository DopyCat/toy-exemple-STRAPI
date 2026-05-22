FROM node:20-alpine
WORKDIR /app
COPY package.json package-lock.json* ./
RUN npm ci --only=production --silent || npm install --only=production --silent
COPY . .
EXPOSE 4000
CMD ["node","server.js"]
