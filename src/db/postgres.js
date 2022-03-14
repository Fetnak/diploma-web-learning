import pg from "pg";
import "../loadEnv.js";

// if (process.env.NODE_ENV === "production") {
//     connect.ssl = {
//       rejectUnauthorized: false
//     };
// }

const connectionString = process.env.POSTGRES_URL;

const pool = new pg.Pool({ connectionString });

export default pool;
