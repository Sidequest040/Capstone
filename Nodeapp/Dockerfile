FROM --platform=amd64 node:14

WORKDIR /usr/app

COPY package.json .
RUN npm install

COPY . .

EXPOSE 3000

CMD ["node", "app.js"]
