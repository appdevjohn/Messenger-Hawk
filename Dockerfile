FROM node:14

COPY package.json .

RUN npm install

COPY . .

RUN npm run build

CMD [ "npm", "run", "prod" ]