const fs = require("fs");
const PostgresDriver = require("@cubejs-backend/postgres-driver");
const BigQueryDriver = require("@cubejs-backend/bigquery-driver");

/**
 * Cube.js configuration with two datasources:
 *   - "default"  → Cloud SQL Postgres (Nais-injected DB_* env vars)
 *   - "bigquery" → BigQuery via Workload Identity (Application Default Credentials)
 *
 * https://cube.dev/docs/config
 */
module.exports = {
  dbType: ({ dataSource }) => {
    if (dataSource === "bigquery") return "bigquery";
    return "postgres";
  },

  driverFactory: ({ dataSource }) => {
    if (dataSource === "bigquery") {
      return new BigQueryDriver({
        // projectId is the billing project — queries are run and billed here.
        // On Nais this is the team's GCP project; locally set BQ_BILLING_PROJECT
        // (defaults to BQ_PROJECT_ID if not set separately).
        projectId: process.env.BQ_BILLING_PROJECT || process.env.BQ_PROJECT_ID,
        dataset: process.env.BQ_DATASET,
        // No keyFilename — uses Workload Identity on Nais, ADC locally
      });
    }

    // default: Cloud SQL Postgres
    const ssl = process.env.DB_SSLROOTCERT
      ? {
          rejectUnauthorized: true,
          // Cloud SQL Auth Proxy listens on localhost, but the cert is issued for the
          // actual Cloud SQL hostname. Skip hostname check; the proxy handles the real
          // TLS tunnel to Cloud SQL.
          checkServerIdentity: () => undefined,
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
