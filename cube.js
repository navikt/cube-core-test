const fs = require("fs");
const PostgresDriver = require("@cubejs-backend/postgres-driver");

/**
 * Cube.js configuration.
 * Maps Nais-injected DB_* env vars (from gcp.sqlInstances) to the Postgres driver.
 * SSL is enabled when Nais injects DB_SSLROOTCERT (always the case on dev-gcp).
 * https://cube.dev/docs/config
 */
module.exports = {
  dbType: "postgres",
  driverFactory: () => {
    const ssl = process.env.DB_SSLROOTCERT
      ? {
          rejectUnauthorized: true,
          ca: fs.readFileSync(process.env.DB_SSLROOTCERT).toString(),
          cert: fs.readFileSync(process.env.DB_SSLCERT).toString(),
          key: fs.readFileSync(process.env.DB_SSLKEY).toString(),
        }
      : false;

    return new PostgresDriver({
      host: process.env.DB_HOST,
      port: process.env.DB_PORT ? parseInt(process.env.DB_PORT, 10) : 5432,
      database: process.env.DB_DATABASE,
      user: process.env.DB_USERNAME,
      password: process.env.DB_PASSWORD,
      ssl,
    });
  },
};
