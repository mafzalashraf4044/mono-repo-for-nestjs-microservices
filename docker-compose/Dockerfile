FROM node:18.16.0-alpine3.16

WORKDIR /app

COPY . .

RUN npm install --global nx@latest

RUN npm install

CMD ["npm", "run", "start", "app-1"]