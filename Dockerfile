FROM node:alpine
WORKDIR /poster-epi
COPY package*.json .
RUN npm install
COPY . .
ENV PORT=80
ENV POSTER_STRUCTURE_URL=http://localhost:80/index.html
CMD ["npm", "start"]


