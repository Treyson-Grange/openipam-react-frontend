FROM node:20-alpine as build

WORKDIR /usr/app
COPY . /usr/app

RUN npm install
RUN npm run build

FROM nginx:alpine
EXPOSE 80
COPY ./nginx.conf /etc/nginx/conf.d/default.conf
COPY --from=build /usr/app/dist /usr/share/nginx/html

CMD ["nginx", "-g", "daemon off;"]
