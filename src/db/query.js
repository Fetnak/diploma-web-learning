import postgres from "./postgres.js";
import log from "../middleware/logger.js";

export default async function query(remoteAddr, text, params) {
  log(remoteAddr, "sql", text);
  return postgres.query(text, params);
}
