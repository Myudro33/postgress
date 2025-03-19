import pkg from "pg";
const { Pool } = pkg;

const pool = new Pool({
    user: process.env.DB_USER || "myuser",
    host: process.env.DB_HOST || "localhost",
    database: process.env.DB_NAME || "postgres",
    password: process.env.DB_PASSWORD || "nika123",
    port: process.env.DB_PORT ? parseInt(process.env.DB_PORT, 10) : 5432,
});

export default pool
