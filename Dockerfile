FROM node:18 as builder
COPY . /app
WORKDIR /app

ARG NODE_ENV

RUN env
RUN yarn install
RUN yarn build

FROM caddy:2.6.2
COPY --from=builder /app/dist /usr/share/caddy/html
COPY conf/Caddyfile /etc/caddy/Caddyfile
