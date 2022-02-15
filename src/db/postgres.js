import pg from "pg";
import "../loadEnv.js";

const connectionString = process.env.PGURI;

const pool = new pg.Pool({ connectionString });

export default pool;
