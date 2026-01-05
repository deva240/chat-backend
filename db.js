const { Pool } = require("pg");

const pool = new Pool({
  user: "postgres",            // your PostgreSQL username
  host: "localhost",
  database: "chat_app",        // name of your database
  password: "deva",   // replace this
  port: 5432,
});

module.exports = pool;
