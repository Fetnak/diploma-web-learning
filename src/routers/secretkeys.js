import Router from "express-promise-router";
import query from "../db/query.js";
import auth from "../middleware/auth.js";

const router = new Router();

// Create new secret key
router.post("/api/v1/secret_keys", auth.administrator, async (req, res, next) => query(
  req.ip,
  "INSERT INTO secret_keys (_key) VALUES ($1)",
  [
    req.body.key
  ]
)
  .then((resp) => res.status(201).send(resp))
  .catch((error) => next(error)));

// Read secret keys
router.get("/api/v1/secret_keys", auth.administrator, async (req, res, next) => {
  query(req.ip, "SELECT * FROM secret_keys")
    .then((resp) => res.status(200).send(resp.rows))
    .catch((error) => next(error));
});

// Delete secret key
router.post("/api/v1/secret_keys/delete", auth.administrator, async (req, res) => query(req.ip, "DELETE FROM secret_keys WHERE _id = $1", [req.body.id])
  .then((resp) => res.status(200).send(resp.rows[0]))
  .catch(() => res.status(400).send()));

// Update secret key
router.patch("/api/v1/secret_keys", auth.administrator, async (req, res) => query(
  req.ip,
  "UPDATE secret_keys SET _key = $1 WHERE _id = $2",
  [
    req.body.key,
    req.body.id
  ]
)
  .then((resp) => res.status(200).send(resp))
  .catch((error) => res.status(400).send(error)));

export default router;
