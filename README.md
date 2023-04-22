# Shift Eligibility

Shift Pro MAX API

## Requirements

- Node 18
- Docker (PostgreSQL)
  
## Run the project

In order to run the project, you need to run the following commands:

#### Build
```bash
mv .env.example .env
npm ci
npm run build
```
#### Prepare Database
In order to have some seed data, you need to run the following commands:
```bash
npm run db:up # Remove the -d flag in order to avoid running in background
npm run prisma:init  
```

if you don't want seed data, add the `--skip-seed` flag to the `prisma:init` command:

```bash
npm run prisma:init -- --skip-seed
```
#### Run #####
In order to start the project, you need to run the following command:
```bash
npm run start
```
There is a swagger documentation available at [http://localhost:3000/api-docs](http://localhost:3000/api-docs)
## Tests and Development ##
For development, you can run the following command:
```bash
npm run dev
```

For running tests, you can run the following command:
```bash
npm run test
```

If you want to run an specific test, you can run the following command:
```bash
npm run test:unit
```

or

```bash
npm run test:integration
```

In order to run integration tests, you need a database up and running