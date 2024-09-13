FROM node:20-alpine as build

WORKDIR /usr/app
COPY package*.json ./

RUN npm install
COPY . .
RUN npm run build

FROM nginx:alpine
EXPOSE 80
COPY ./nginx.conf /etc/nginx/conf.d/default.conf
COPY --from=build /usr/app/dist /usr/share/nginx/html

CMD ["nginx", "-g", "daemon off;"]
