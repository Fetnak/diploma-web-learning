import express from "express";
import postgres from "./db/postgres.js";
import usersRouter from "./routers/users.js";
import filesRouter from "./routers/files.js";

const app = express();

export default app;

app.use(express.json());
app.use(usersRouter);
app.use(filesRouter);

postgres.query("SELECT NOW()", (err, res) => {
  if (!err) {
    console.log(res.rows);
  } else {
    console.log(err);
  }
});
