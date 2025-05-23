# Test brain.ag - Agricultural management Api

## Description

This project is a backend for a agricultural management system. The project is developed as a part of a challenge from [brain.ag](https://www.serasaexperian.com.br/solucoes/agro/).

## Technologies

- [Node](https://nodejs.org/)
- [Nest](https://github.com/nestjs/nest)
- [TypeScript](https://www.typescriptlang.org/)
- [Prisma](https://www.prisma.io/)
- [PostgreSQL](https://www.postgresql.org/)
- [PNPM](https://pnpm.io/)
- [Jest](https://jestjs.io/)
- [Supertest](https://www.npmjs.com/package/supertest)

## Environment variables

```bash
# Database url
DATABASE_URL=postgres://postgres:postgres@localhost:5432/postgres

# Optional: Port for the API server (default: 3000)
PORT=3000
```

## Project setup

You can run the project with docker compose:

```bash
$ docker-compose up --build
```

or with the following commands:

```bash
# Install dependencies
$ pnpm install

# Generate prisma client (using schema.prisma)
$ pnpm prisma generate

# Start a database container (if is necessary)
$ docker compose up -d --build 'postgres'

# Run migrations
$ pnpm prisma migrate deploy

# run application in watch mode
$ pnpm run start:dev
```

## API Documentation

After running the application, you can access the Swagger UI at [http://localhost:3000/api](http://localhost:3000/api)

## Compile and run the project

```bash
# development
$ pnpm run start

# watch mode
$ pnpm run start:dev

# production mode
$ pnpm run start:prod
```

## Using docker

Docker compose is configured with application container, database container (port 5432) and test database container (port 5433).

```bash
$ docker-compose up --build
```

## Run tests

The project uses jest for unit tests. For e2e tests, it uses jest and supertest.

```bash
# unit tests
$ pnpm run test

# e2e tests
$ pnpm run test:e2e

# e2e tests with docker (will delete container and recreate)
$ pnpm run test:e2e:docker

# test coverage
$ pnpm run test:cov
```

## Prisma (ORM)

```bash
# create a new migration with the name
$ pnpm prisma migrate dev --name name-of-migration

# run all migrations pending in the database
$ pnpm prisma migrate deploy

# generate prisma client (client is necessary for the application)
$ pnpm prisma generate
```

## DB - Entity Relationship Diagram

![ERD](./readme/ERD.png)
