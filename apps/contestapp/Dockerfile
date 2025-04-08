FROM node:18-alpine as build
WORKDIR /app
COPY . .
RUN npm install -g nx && npm install
RUN nx build contestapp --prod

FROM nginx:alpine
COPY --from=build /app/dist/apps/contestapp /usr/share/nginx/html
COPY apps/contestapp/nginx.conf /etc/nginx/conf.d/default.conf
EXPOSE 80
