FROM node:14-alpine AS builder

WORKDIR /app

COPY package*.json .

RUN npm install

COPY . .

RUN npm run-script build


FROM nginx

COPY --from=builder /app/build /usr/share/nginx/html

ADD ./nginx.conf /etc/nginx/conf.d/default.conf
