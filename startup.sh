apt-get update && apt-get upgrade
apt-get install -y ca-certificates apt-transport-https 
apt-get install -y wget gnupg
wget -q https://packages.sury.org/php/apt.gpg -O- | apt-key add -
echo "deb https://packages.sury.org/php/ stretch main" | tee /etc/apt/sources.list.d/php.list
apt-get update && apt-get install -y php7.2 php7.2-xml php7.2-gd php7.2-opcache php7.2-mbstring php7.2-zip curl git unzip libz-dev
curl -sS https://getcomposer.org/installer | php -- --install-dir=/usr/local/bin --filename=composer 

composer global require laravel/installer -q