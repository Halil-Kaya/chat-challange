FROM node
WORKDIR /usr/src/app
ADD . /usr/src/app/
RUN npm install --force
CMD npm run start:dev
EXPOSE 3032
CMD [ "npm", "run","start:dev" ]