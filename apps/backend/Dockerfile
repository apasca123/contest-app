FROM node:18-alpine
WORKDIR /app
COPY . .
RUN npm install -g nx && npm install
RUN nx build backend
CMD ["node", "dist/apps/backend/main.js"]
EXPOSE 3000
