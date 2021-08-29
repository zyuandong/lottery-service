FROM centos/nodejs-12-centos7

USER root
RUN mkdir -p /home/lottery-service
WORKDIR /home/lottery-service

# Bundle app source
COPY . /home/lottery-service
RUN npm install

EXPOSE 3000
CMD [ "npm", "start" ]