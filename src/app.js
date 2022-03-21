import { createServer } from "http";
import express from "express";
import cors from "cors";
import session from "express-session";
import pgSession from "connect-pg-simple";
import postgres from "./db/postgres.js";
import usersRouter from "./routers/users.js";
import filesRouter from "./routers/files.js";
import groupsRouter from "./routers/groups.js";
import subjectsRouter from "./routers/subjects.js";
import documentsRouter from "./routers/documents.js";
import secretkeysRouter from "./routers/secretkeys.js";

const app = express();
const server = createServer(app);

export default server;

const PgSession = pgSession(session);

const sessionMiddleware = session({
  store: new PgSession({
    pool: postgres
  }),
  secret: process.env.JWT_KEY,
  resave: false,
  saveUninitialized: false,
  cookie: { maxAge: 2592000000 } // 30 days
});

app.use([
  cors({
    origin: true,
    allowedHeaders: "Content-Type, Cache-Control",
    methods: ["GET", "POST", "PATCH", "DELETE"],
    credentials: true
  }),
  sessionMiddleware,
  express.json(),
  usersRouter,
  filesRouter,
  documentsRouter,
  groupsRouter,
  subjectsRouter,
  secretkeysRouter
]);

postgres.query("SELECT NOW()", (err, res) => {
  if (!err) {
    console.log(res.rows);
  } else {
    console.log(err);
  }
});
