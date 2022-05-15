FROM node:17.9.0 AS build

WORKDIR /app

ARG VM_HOST
ARG BACKEND_PORT
ARG BUILD_NUM

ENV VM_HOST=$VM_HOST
ENV BACKEND_PORT=$BACKEND_PORT
ENV BUILD_NUM=$BUILD_NUM

COPY . .

RUN npm ci
RUN npm run build


FROM nginx:latest AS start

WORKDIR /usr/share/nginx/html

COPY --from=build /app/dist ./
COPY --from=build /app/.github/workflows/scripts/frontend.conf /etc/nginx/conf.d/default.conf
