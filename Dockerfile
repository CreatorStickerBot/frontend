FROM node:17.9.0 AS build

WORKDIR /app

COPY . .

RUN npm ci
RUN npm run build


FROM nginx:latest AS start

WORKDIR /usr/share/nginx/html

COPY --from=build /app/dist ./

#WORKDIR /app
#
#RUN npm ci
#RUN npm run build
#
#CMD ['mv', '/app/dist', '/var/www/html']
#CMD ['rmdir', '/app']
#
##COPY /app /var/www/html
