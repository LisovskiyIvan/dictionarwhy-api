FROM oven/bun:latest AS build

WORKDIR /app
COPY package*.json ./
RUN bun install
COPY . .

CMD 'bun' 'prod'