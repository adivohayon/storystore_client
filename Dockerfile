FROM node:10-alpine

RUN mkdir -p /usr/src/app
RUN chown -R node:node /usr/src/app

ENV NODE_ENV=production

EXPOSE 3000

WORKDIR /usr/src/app
USER node

COPY package*.json ./
RUN npm install --quiet --no-progress && npm cache clean --force

COPY . .

CMD ["node", "server/server.js"]
