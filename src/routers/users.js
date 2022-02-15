import express from "express";
import bcrypt from "bcryptjs";
import validator from "validator";
// import postgres from "../db/postgres.js";
import query from "../db/query.js";

const router = new express.Router();

// Create new user
router.post("/users", async (req, res) => {
  const values = Object.keys(req.body);
  const allowedValues = ["login", "password", "name", "email", "role"];
  const isValidOperation = values.every((update) => allowedValues.includes(update));

  if (!isValidOperation) {
    return res.status(400).send({ error: "invalid values!" });
  }
  if (!validator.isEmail(req.body.email)) {
    return res.status(400).send({ error: "invalid email!" });
  }
  if (req.body.password.length < 8) {
    return res.status(400).send({ error: "Password is too short!" });
  }

  const checkedValues = {
    login: req.body.login,
    password: await bcrypt.hash(req.body.password, 8),
    name: req.body.login,
    email: req.body.email,
    role: req.body.role
  };

  return query(req.ip, "INSERT INTO users (_login, _password, _name, email, role) VALUES ($1, $2, $3, $4, $5)", [checkedValues.login, checkedValues.password, checkedValues.name, checkedValues.email, checkedValues.role])
    .then((resp) => res.status(201).send(resp))
    .catch((e) => res.status(400).send(e));
});

// Read user
router.get("/users", async (req, res) => {
  const values = Object.keys(req.body);
  const allowedValues = ["id"];
  const isValidOperation = values.every((update) => allowedValues.includes(update));

  if (!isValidOperation) {
    return res.status(400).send({ error: "invalid values!" });
  }

  return query(req.ip, "SELECT * FROM users WHERE _id = $1", [req.body.id])
    .then((resp) => res.status(201).send(resp.rows[0]))
    .catch((e) => res.status(400).send(e));
});

export default router;
