FROM node
WORKDIR /usr/src/app
ADD . /usr/src/app/
RUN npm install
EXPOSE 3032
CMD [ "npm", "run","start:prod" ]