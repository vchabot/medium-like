FROM node:14.14.0-alpine

WORKDIR /var/www/html

#COPY package*.json ./

RUN apk --no-cache add --virtual builds-deps build-base python && \
    npm config set python /usr/bin/python && \
    npm i -g npm && \
    npm install && \
    npm rebuild bcrypt --build-from-source && \
    apk del builds-deps
# For production only
# RUN npm ci --only=production

COPY . .

EXPOSE 8080
CMD ["node", "server.js"]

