FROM node:8.2.1

MAINTAINER Patiphan

LABEL "version"="1.0.0"

RUN mkdir -p /var/www/app/blog

WORKDIR /var/www/app/blog
ADD package.json ./
RUN npm i --only=production
RUN npm i --only=dev

ADD . /var/www/app/blog

EXPOSE 8080

CMD ["npm", "start"]
