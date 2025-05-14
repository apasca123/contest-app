# Etapa: doar runtime – presupune că ai rulat nx build pe local
FROM node:18-alpine
WORKDIR /app

# Copiază doar codul compilat
COPY dist/apps/backend ./dist

# Copiază pachetul pentru deps
COPY package.json package-lock.json ./

# Instalează DOAR deps de runtime (fără devDependencies)
RUN npm install
COPY dist/apps/data ./data

EXPOSE 3000
CMD ["node", "dist/main.js"]
