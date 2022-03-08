import express from "express";
import cors from "cors";
import postgres from "./db/postgres.js";
import testRouter from "./routers/test.js";
import usersRouter from "./routers/users.js";
import filesRouter from "./routers/files.js";

const app = express();

export default app;

app.use(express.json());
app.use(
  cors({
    origin: true,
    allowedHeaders: "Content-Type, Cache-Control",
    methods: ["GET", "POST", "PATCH", "DELETE"],
    credentials: true
  })
);
app.use(testRouter);
app.use(usersRouter);
app.use(filesRouter);

postgres.query("SELECT NOW()", (err, res) => {
  if (!err) {
    console.log(res.rows);
  } else {
    console.log(err);
  }
});
