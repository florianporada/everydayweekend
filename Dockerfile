FROM node:6.14.4 as builder

LABEL description="Base-image for simple static websites"
LABEL project="everydayweekend.net"
LABEL maintainer="florian.porada@gmail.com"

WORKDIR /src

COPY package.json .

RUN npm install

COPY . .

RUN ./node_modules/bower/bin/bower install --allow-root

RUN ./node_modules/gulp/bin/gulp.js build-dist

FROM nginx
EXPOSE 80

COPY --from=builder /src/build /usr/share/nginx/html