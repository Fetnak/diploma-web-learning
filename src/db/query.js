import postgres from "./postgres.js";
import log from "../middleware/logger.js";

export default async function query(userIP, text, params) {
  log(userIP, "sql", text);
  return postgres.query(text, params);
}
