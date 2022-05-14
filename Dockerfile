FROM node:17.9.0 AS build

WORKDIR /app

ARG API_URL
ENV API_URL=$API_URL

COPY . .

RUN npm ci
RUN npm run build


FROM nginx:latest AS start

WORKDIR /usr/share/nginx/html

COPY --from=build /app/dist ./
