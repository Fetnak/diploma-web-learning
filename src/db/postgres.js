import pg from "pg";
import "../loadEnv.js";

// eslint-disable-next-line no-undef
const connectionString = process.env.PGURI;

console.log(connectionString);

const pool = new pg.Pool({ connectionString });

export default pool;
