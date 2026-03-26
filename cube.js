const PostgresDriver = require("@cubejs-backend/postgres-driver");

/**
 * Cube.js configuration.
 * Maps Nais-injected DB_* env vars (from gcp.sqlInstances) to the Postgres driver.
 * https://cube.dev/docs/config
 */
module.exports = {
  dbType: "postgres",
  driverFactory: () =>
    new PostgresDriver({
      host: process.env.DB_HOST,
      port: process.env.DB_PORT ? parseInt(process.env.DB_PORT, 10) : 5432,
      database: process.env.DB_DATABASE,
      user: process.env.DB_USERNAME,
      password: process.env.DB_PASSWORD,
    }),
};
