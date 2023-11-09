const { Pool } = require("pg");

const pool = new Pool({
  user: "postgres",
  password: "Cetys2023_bb",
  host: "db.elbmwjxnqlxvoinecxvk.supabase.co",
  port: 5432, // default Postgres port
  database: "postgres",
});

module.exports = {
  query: (text, params) => pool.query(text, params),
};
