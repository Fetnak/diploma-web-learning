import express from "express";
import postgres from "./db/postgres.js";
import usersRouter from "./routers/users.js";

const app = express();

export default app;

app.use(express.json());
app.use(usersRouter);

postgres.query("SELECT NOW()", (err, res) => {
  if (!err) {
    console.log(res.rows);
  } else {
    console.log(err);
  }
});
