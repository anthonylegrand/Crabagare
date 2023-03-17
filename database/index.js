require("dotenv").config();
const { Client } = require("pg");

const clientPostgres = new Client({
  host: process.env.DATABASE_HOST,
  port: process.env.DATABASE_PORT,
  user: process.env.DATABASE_USER,
  database: process.env.DATABASE_DATABASE,
  password: process.env.DATABASE_PASSWORD,
});

clientPostgres
  .connect()
  .then(() => {
    console.log("PostgresSQL connected");
  })
  .catch((err) => console.error("PostgresSQL connection error", err.stack));

module.exports = clientPostgres;
