# === STAGE 1: Build Angular App ===
FROM node:18-alpine AS builder
WORKDIR /app

# Copiem codul sursă și instalăm deps
COPY . .
RUN npm install -g nx && npm install

# Build production Angular app
RUN nx build contestapp --configuration=production

# === STAGE 2: NGINX container pentru servire statică ===
FROM nginx:alpine
WORKDIR /usr/share/nginx/html

# Ștergem fișierele default servite de NGINX
RUN rm -rf ./*

# Copiem buildul din etapa anterioară
COPY --from=builder /app/dist/apps/contestapp ./

# Copiem configurația NGINX (cu proxy către backend)
COPY apps/contestapp/nginx.conf /etc/nginx/conf.d/default.conf

# Expunem portul pentru acces (folosit în docker-compose)
EXPOSE 80

# Pornim NGINX
CMD ["nginx", "-g", "daemon off;"]
