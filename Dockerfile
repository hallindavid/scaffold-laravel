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
FROM registry.cto.ai/official_images/base:latest

ADD startup.sh /root/
RUN chmod +x /root/startup.sh
RUN /root/startup.sh
#RUN apt update 
#RUN apt upgrade
#RUN apt install -y ca-certificates apt-transport-https 
#RUN apt-get install -y wget gnupg
#RUN wget -q https://packages.sury.org/php/apt.gpg -O- | apt-key add -
#RUN echo "deb https://packages.sury.org/php/ stretch main" | tee /etc/apt/sources.list.d/php.list
#RUN apt-get update && install -y php7.2 php7.2-xml php7.2-gd php7.2-opcache php7.2-mbstring php7.2-zip curl git unzip libz-dev
#RUN curl -sS https://getcomposer.org/installer | php -- --install-dir=/usr/local/bin --filename=composer 
#RUN composer --version && php -v
#RUN composer global require laravel/installer

WORKDIR /ops
COPY --from=dep /ops .
