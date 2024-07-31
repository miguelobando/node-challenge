# Node challenge 

## Description

Node challenge developed with NestJS, TypeORM, PostgreSQL, RabbitMQ and Docker.
Made with Nestjs in monorepo architecture. I developed 2 apps, one for the API and another for the stock service. 

The Stock service is a microservice that is responsible for obtaining the stock data and sending it to the API through a queue.

The API is responsible for managing the data of the users, the actions and the statistics of the actions.

## Api-service moduless

 Auth
 : Authentication module with JWT and Passport.

 User
 : Manage the register and login of users.

 Stock
 : Manage getting stock data and their historical.

 Stats
 : Manages obtaining the statistics of the actions 
 and the times they have been consulted.

Mail
: Manages sending emails to users.

## Dependencies

| Package Name                     | Version |
| -------------------------------  | ------- |
| @nestjs/axios                    | ^3.0.0  |
| @nestjs/common                   | ^10.0.0 |
| @nestjs/config                   | ^3.1.1  |
| @nestjs/core                     | ^10.0.0 |
| @nestjs/jwt                      | ^10.1.1 |
| @nestjs/mapped-types             | ^2.0.2  |
| @nestjs/microservices            | ^10.2.5 |
| @nestjs/passport                 | ^10.0.2 |
| @nestjs/platform-express         | ^10.0.0 |
| @nestjs/swagger                  | ^7.1.11 |
| @nestjs/typeorm                  | ^10.0.0 |
| @types/passport-jwt              | ^3.0.9  |
| amqp-connection-manager          | ^4.1.14 |
| amqplib                          | ^0.10.3 |
| axios                            | ^1.5.0  |
| class-transformer                | ^0.5.1  |
| class-validator                  | ^0.14.0 |
| passport                         | ^0.6.0  |
| passport-jwt                     | ^4.0.1  |
| pg                               | ^8.11.3 |
| reflect-metadata                 | ^0.1.13 |
| rxjs                             | ^7.8.1  |
| typeorm                          | ^0.3.17 |

## Dev Dependencies

| Package Name                     | Version |
| -------------------------------  | ------- |
| @nestjs/cli                      | ^10.0.0 |
| @nestjs/schematics               | ^10.0.0 |
| @nestjs/testing                  | ^10.0.0 |
| @types/express                   | ^4.17.17|
| @types/jest                      | ^29.5.2 |
| @types/node                      | ^20.3.1 |
| @types/supertest                 | ^2.0.12 |
| @typescript-eslint/eslint-plugin | ^6.0.0  |
| @typescript-eslint/parser        | ^6.0.0  |
| eslint                           | ^8.42.0 |
| eslint-config-prettier           | ^9.0.0  |
| eslint-plugin-prettier           | ^5.0.0  |
| jest                             | ^29.5.0 |
| prettier                         | ^3.0.0  |
| source-map-support               | ^0.5.21 |
| supertest                        | ^6.3.3  |
| ts-jest                          | ^29.1.0 |
| ts-loader                        | ^9.4.3  |
| ts-node                          | ^10.9.1 |
| tsconfig-paths                   | ^4.2.0  |
| typescript                       | ^5.1.3  |

## Installation

You must open 4 terminals and run the following commands in each one.
PD: i know there is a better way to do this using docker compose, but i had some problems with it.



```bash

docker build  -f services/db.Dockerfile -t db .

docker run -p 5432:5432 db

---------- in another terminal ----------


docker build  -f services/rabbitmq.Dockerfile -t rabbitmq .

docker run -it --rm -p 5672:5672 -p 15672:15672 rabbitmq

---------- in another terminal ---------- 
yarn install
yarn start api-service

---------- in another terminal ---------- 

yarn start stock-service

```

## Env variables (You have to create a .env file in the root of the project with next variables)

- JWT_SECRET='this_is_my_config'
- DB_USERNAME = 'postgres'
- DB_PASSWORD = 'pass123'
- DB_NAME = 'mydatabase'
- DB_HOST = 'localhost:5432'
- DB_SCHEMA = 'public'
- MAIL_PASSWORD = 'z4MXnpZWjJTby7wB'
- MAIL_USER = 'ciberaries64@gmail.com'
- SMTP_HOST = 'smtp-relay.sendinblue.com'
- RMQ_URL = 'amqp://localhost:5672'
- RMQ_QUEUE = 'stock_queue'

## Documentation

You can find the documentation of the API in the following link
after start an api-service instance. [http://localhost:3001/documentation/#/](link)

## License
MIT
