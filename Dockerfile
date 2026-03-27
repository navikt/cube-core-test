FROM cubejs/cube:latest

# Install BigQuery driver (Postgres driver is bundled in the base image)
RUN npm install --prefix /cube @cubejs-backend/bigquery-driver

COPY cube.js /cube/conf/cube.js
COPY model /cube/conf/model
