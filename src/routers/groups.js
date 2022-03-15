// import Router from "express-promise-router";
import express from "express";
import query from "../db/query.js";
import auth from "../middleware/auth.js";

// const router = new Router();

const router = new express.Router();

// Create new group
router.post("/api/v1/group", auth.administrator, async (req, res, next) => {
  const values = Object.keys(req.body);
  const allowedValues = [
    "name"
  ];

  const isValidOperation = values.every((update) => allowedValues.includes(update));

  if (!isValidOperation) {
    return res.status(400).send({ error: "invalid values!" });
  }

  return query(
    req.ip,
    "INSERT INTO groups (_name) VALUES ($1)",
    [
      req.body.name
    ]
  )
    .then((resp) => res.status(201).send(resp))
    .catch((error) => next(error));
});

// Read groups
router.get("/api/v1/group", async (req, res, next) => {
  query(req.ip, "SELECT * FROM groups")
    .then((resp) => res.status(200).send(resp.rows))
    .catch((error) => next(error));
});

// Delete group
router.delete("/api/v1/group", auth.administrator, async (req, res, next) => {
  const values = Object.keys(req.body);
  const allowedValues = ["id"];
  const isValidOperation = values.every((update) => allowedValues.includes(update));

  if (!isValidOperation) {
    return res.status(400).send({ error: "invalid values!" });
  }

  return query(req.ip, "DELETE FROM groups WHERE _id = $1", [req.body.id])
    .then((resp) => res.status(200).send(resp.rows[0]))
    .catch((error) => next(error));
});

// Update group
router.patch("/api/v1/group", auth.administrator, async (req, res) => {
  const values = Object.keys(req.body);
  const allowedValues = ["id", "name"];
  const isValidOperation = values.every((update) => allowedValues.includes(update));

  if (!isValidOperation) {
    return res.status(400).send({ error: "invalid values!" });
  }

  return query(
    req.ip,
    "UPDATE groups SET _name = $1 WHERE _id = $2",
    [
      req.body.name,
      req.body.id
    ]
  )
    .then((resp) => res.status(200).send(resp))
    .catch((e) => res.status(500).send(e));
});

export default router;
