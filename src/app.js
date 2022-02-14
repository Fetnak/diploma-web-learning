import express from "express";
import postgres from "./db/postgres.js";
// import usersRouter from "./router/users.js"

const app = express();

export default app;

app.use(express.json());
// app.use(usersRouter)

postgres.query("SELECT NOW()", (err, res) => {
  if (!err) {
    console.log(res);
  } else {
    console.log(err);
  }
});
