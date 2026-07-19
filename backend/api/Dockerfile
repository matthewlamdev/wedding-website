# node:20-bookworm-slim publishes multi-arch images including arm64,
# so this builds fine on a Raspberry Pi (aarch64).
FROM node:20-bookworm-slim

WORKDIR /app

COPY package.json ./
RUN npm install --omit=dev

COPY src ./src

EXPOSE 3001

CMD ["node", "src/server.js"]
