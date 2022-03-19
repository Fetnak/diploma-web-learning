// import Router from "express-promise-router";
import express from "express";
import query from "../db/query.js";
import auth from "../middleware/auth.js";

// const router = new Router();

const router = new express.Router();

// Create new group
router.post("/api/v1/group", auth.administrator, async (req, res) => query(
  req.ip,
  "INSERT INTO groups (_name, specialty, specialization, qualification) VALUES ($1, $2, $3, $4)",
  [
    req.body.name,
    req.body.specialty,
    req.body.specialization,
    req.body.qualification
  ]
)
  .then((resp) => res.status(201).send(resp))
  .catch(() => res.status(400).send()));

// Read groups
router.get("/api/v1/group", async (req, res, next) => {
  query(req.ip, "SELECT * FROM groups")
    .then((resp) => res.status(200).send(resp.rows))
    .catch((error) => next(error));
});

// Delete group
router.post("/api/v1/group/delete", auth.administrator, async (req, res) => query(req.ip, "DELETE FROM groups WHERE _id = $1", [req.body.id]).then((resp) => res.status(200).send(resp.rows[0])).catch(() => res.status(400).send()));

// Update group
router.patch("/api/v1/group", auth.administrator, async (req, res) => query(
  req.ip,
  "UPDATE groups SET (_name, specialty, specialization, qualification) = ($1, $2, $3, $4) WHERE _id = $5;",
  [req.body.name, req.body.specialty, req.body.specialization, req.body.qualification, req.body.id]
)
  .then((resp) => res.status(200).send(resp))
  .catch((e) => res.status(500).send(e)));

export default router;
