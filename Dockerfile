FROM node:19.3.0-alpine3.17

RUN apk add --no-cache chromium

WORKDIR /poster-epi

COPY package*.json .

RUN npm install

RUN chromium_path=$(which chromium-browser) 

COPY . .

RUN addgroup poster-api && adduser -S -G poster-api poster-api

USER poster-api

ENV PUPPETEER_EXECUTABLE_PATH=$chromium_path
ENV PUPPETEER_NO_SANDBOX=1
ENV POSTER_STRUCTURE_URL=http://localhost:3000/
ENV PORT=3000
EXPOSE 3000

CMD ["npm", "start"]
