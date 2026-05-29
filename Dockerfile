FROM node:20-alpine
WORKDIR /app
COPY package.json .
RUN npm install --production
COPY server.js .
COPY .env.example .env
EXPOSE 3456
CMD ["node", "server.js"]
