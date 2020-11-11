# Smart Doctrina

This Symfony 5 application powered by Api Platform aims at exposing the model from the MySQL database.

## Build

You can build the different images you need by launching these commands:

`docker build -t smart_doctrina-phpfpm:latest docker/api`

`docker build -t smart_doctrina-nginx:latest docker/nginx`

## Run

You can run the application by launching this command:

`docker-compose up` with the `-d` flag if you don't want to see the logs in foreground.

## License

This application is under the [MIT License](LICENSE).