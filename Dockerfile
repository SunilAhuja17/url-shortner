
FROM node:23.7.0


WORKDIR /usr/src/app


COPY package.json yarn.lock ./


RUN yarn install --frozen-lockfile


COPY . .

COPY .env .env


RUN yarn prisma generate

RUN yarn build


EXPOSE 3000


CMD ["node", "dist/main.js"]
