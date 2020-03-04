############################
# Build container
############################
FROM node:12-alpine AS dep

WORKDIR /ops

ADD package.json .
RUN npm install
ADD . .

############################
# Final container
############################
FROM registry.cto.ai/official_images/node:latest

ADD startup.sh /root/
RUN chmod +x /root/startup.sh
RUN /root/startup.sh

WORKDIR /ops
COPY --from=dep /ops .

ENV PATH /root/.composer:/root/.composer/vendor/bin:/usr/bin/php7:/usr/bin/php:$PATH

CMD [ "/bin/sh" ]