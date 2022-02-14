import app from "./app.js";
import "./loadEnv.js";

const port = process.env.PORT;

console.log(process.env.PGURI);

app.listen(port, () => {
  console.log(`Server is up on port ${port}`);
});
