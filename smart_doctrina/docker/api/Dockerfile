FROM php:7.4-fpm-alpine

EXPOSE 80
WORKDIR /app

COPY . /app

RUN apk add --update --no-cache libintl icu icu-dev bash git zip libzip-dev && \
    docker-php-ext-install intl zip mysqli pdo pdo_mysql && \
    php -r "copy('https://getcomposer.org/installer', 'composer-setup.php');" && \
    php composer-setup.php --quiet --install-dir=/usr/bin --filename=composer && \
    rm composer-setup.php && \
    wget https://get.symfony.com/cli/installer -O - | bash && \
    mv /root/.symfony/bin/symfony /usr/local/bin/symfony
    #APP_ENV=prod composer install --optimize-autoloader --no-interaction --no-ansi --no-dev && \
    #APP_ENV=prod bin/console cache:clear --no-warmup && \
    #APP_ENV=prod bin/console cache:warmup
    #chown -R www-data:www-data var
    # Reduce container size
    #rm -rf .git assets /root/.composer /tmp/*
