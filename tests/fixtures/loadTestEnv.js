import path from "path";
import dotenv from "dotenv";

const __dirname = path.resolve();

if (process.env.NODE_ENV !== "production") {
  dotenv.config({ path: path.join(__dirname, "../../config/dev.env"), debug: true });
}
