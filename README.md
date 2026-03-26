# cube-core-test

MVP for testing [Cube.js](https://cube.dev) on the Nais platform (dev-gcp).

## Local development

```bash
cp .env.example .env
# Edit .env as needed
docker compose up
```

Cube.js Playground: http://localhost:4000

## Environment variables

| Variable | Source | Description |
|---|---|---|
| `CUBEJS_API_SECRET` | Nais secret `cube-api-secret` | API signing secret |
| `DB_HOST` | Nais (gcp.sqlInstances) | Postgres host |
| `DB_PORT` | Nais (gcp.sqlInstances) | Postgres port |
| `DB_DATABASE` | Nais (gcp.sqlInstances) | Database name |
| `DB_USERNAME` | Nais (gcp.sqlInstances) | Database user |
| `DB_PASSWORD` | Nais (gcp.sqlInstances) | Database password |

## Data model

Example cube defined in `model/cubes/orders.yml`. Extend with your own cubes as needed.
