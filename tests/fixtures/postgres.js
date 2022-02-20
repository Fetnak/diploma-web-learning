import pg from "pg";
import "./loadTestEnv.js";

const connectionString = process.env.PGURI;

const pool = new pg.Pool({ connectionString });

export default pool;
