# Tutorial Sequelize Router

### Installation

```
npm i
```

### Environment

Copy the `sample.env` into an `.env` file.

### Starting docker services

```
docker-compose up
```

### Local Development

```
http://localhost:3000
```

### Run migrations

```
docker-compose run --rm api npm run migrate
```

### Run seeder

```
docker-compose run --rm api npm run seed
```

## API

GET /api/v1/customers

- Get an array of customers

GET /api/v1/customers/:id

- Get one customer by id

POST /api/v1/customers

- Create a customer

PUT /api/v1/customers/:id

- Update a customer by id

DELETE /api/v1/customers/:id

- Delete a customer by id
