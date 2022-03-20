import Router from "express-promise-router";
import query from "../db/query.js";
import auth from "../middleware/auth.js";

const router = new Router();

// Create new subject
router.post("/api/v1/subjects", auth.administrator, async (req, res, next) => query(
  req.ip,
  "INSERT INTO subjects (_name, short_name) VALUES ($1, $2)",
  [
    req.body.name,
    req.body.short_name
  ]
)
  .then((resp) => res.status(201).send(resp))
  .catch((error) => next(error)));

// Read subjects
router.get("/api/v1/subjects", auth.teacher, async (req, res, next) => {
  query(req.ip, "SELECT * FROM subjects")
    .then((resp) => res.status(200).send(resp.rows))
    .catch((error) => next(error));
});

// Delete subject
router.post("/api/v1/subjects/delete", auth.administrator, async (req, res) => query(req.ip, "DELETE FROM subjects WHERE _id = $1", [req.body.id])
  .then((resp) => res.status(200).send(resp.rows[0]))
  .catch(() => res.status(400).send()));

// Update subject
router.patch("/api/v1/subjects", auth.administrator, async (req, res) => query(
  req.ip,
  "UPDATE subjects SET (_name, short_name) = ($1, $2) WHERE _id = $3",
  [
    req.body.name,
    req.body.short_name,
    req.body.id
  ]
)
  .then((resp) => res.status(200).send(resp))
  .catch((error) => res.status(400).send(error)));

export default router;
