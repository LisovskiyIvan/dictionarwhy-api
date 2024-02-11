FROM oven/bun:latest AS build

WORKDIR /app
# RUN curl -fsSL https://bun.sh/install | BUN_INSTALL=/bin/sh
COPY package*.json ./
RUN bun install
COPY . .
EXPOSE 8080

CMD 'bun' 'prod'