import express from "express";
import bcrypt from "bcryptjs";
import validator from "validator";
import query from "../db/query.js";
import auth from "../middleware/auth.js";

const router = new express.Router();

// Create new user
router.post("/users", async (req, res) => {
  const values = Object.keys(req.body);
  const allowedValues = ["login", "password", "name", "email", "group_id", "role"];
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
    name: req.body.name,
    email: req.body.email,
    group_id: req.body.group_id,
    role: req.body.role
  };

  return query(req.ip, "INSERT INTO users (_login, _password, _name, email, group_id, role) VALUES ($1, $2, $3, $4, $5, $6)", [checkedValues.login, checkedValues.password, checkedValues.name, checkedValues.email, checkedValues.group_id, checkedValues.role])
    .then((resp) => res.status(201).send(resp))
    .catch((e) => res.status(400).send(e));
});

// Log in exited user
router.post("/users/login", async (req, res) => {
  const user = await auth.findByCredentials(req.body.email, req.body.password);
  const token = await auth.generateAuthToken(user);
  res.send({ user, token });
});

// Read user
router.get("/users", auth.auth, async (req, res) => query(req.ip, "SELECT * FROM users WHERE _id = $1", [req.user.rows[0]._id]).then((resp) => res.status(200).send(resp.rows[0])).catch((e) => res.status(400).send(e)));

// Delete user
router.delete("/users", auth.auth, async (req, res) => {
  const values = Object.keys(req.body);
  const allowedValues = ["id"];
  const isValidOperation = values.every((update) => allowedValues.includes(update));

  if (!isValidOperation) {
    return res.status(400).send({ error: "invalid values!" });
  }

  return query(req.ip, "DELETE FROM users WHERE _id = $1", [req.body.id])
    .then((resp) => res.status(200).send(resp.rows[0]))
    .catch((e) => res.status(500).send(e));
});

// Delete current user
router.delete("/users/delete", auth.auth, async (req, res) => query(req.ip, "DELETE FROM users WHERE _id = $1", [req.user.rows[0]._id]).then((resp) => res.status(200).send(resp.rows[0])).catch((e) => res.status(500).send(e)));

// Update user
router.patch("/users/me", auth.auth, async (req, res) => {
  const values = Object.keys(req.body);
  const allowedValues = ["password", "name", "email", "group_id"];
  const isValidOperation = values.every((update) => allowedValues.includes(update));

  if (!isValidOperation) {
    return res.status(400).send({ error: "invalid values!" });
  }

  const checkedValues = {
    password: req.user.rows[0]._password,
    name: req.user.rows[0]._name,
    email: req.user.rows[0].email
  };

  if (req.body.password) {
    checkedValues.password = await bcrypt.hash(req.body.password, 8);
  }
  if (req.body.name) {
    checkedValues.name = req.body.name;
  }
  if (req.body.email) {
    checkedValues.email = req.body.email;
  }

  return query(req.ip, "UPDATE users SET (_password, _name, email) = ($1, $2, $3) WHERE _id = $4", [checkedValues.password, checkedValues.name, checkedValues.email, req.user.rows[0]._id])
    .then((resp) => res.status(200).send(resp))
    .catch((e) => res.status(500).send(e));
});

export default router;
