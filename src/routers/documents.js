import express from "express";
import { v4 as uuidv4 } from "uuid";
import auth from "../middleware/auth.js";
import query from "../db/query.js";

const router = new express.Router();

// Create new document
router.post("/api/v1/documents/create", auth.student, async (req, res) => {
  if (req.user.rows.length === 0) {
    return res.status(401).send({ error: "Authenticate please!" });
  }

  const checkedValues = {
    id: uuidv4(),
    name: req.body.name,
    document_id: req.body.document_id,
    subject_id: req.body.subject_id,
    group_id: req.body.group_id,
    file_id: req.body.file_id
  };

  return query(
    req.ip,
    "INSERT INTO documents (_id, _name, document_id, subject_id, group_id, file_id) VALUES ($1, $2, $3, $4, $5, $6)",
    [
      checkedValues.id,
      checkedValues.name,
      checkedValues.document_id,
      checkedValues.subject_id,
      checkedValues.group_id,
      checkedValues.file_id
    ]
  )
    .then((resp) => res.status(201).send({ id: checkedValues.id, resp }))
    .catch((e) => res.status(400).send(e));
});

// Read all documents for current user's group
router.get("/api/v1/documents/read", auth.student, async (req, res) => {
  query(
    req.ip,
    "SELECT _id, _name, document_id, subject_id, file_id FROM documents WHERE group_id = (SELECT group_id FROM users WHERE _id = $1)",
    [req.session.userId]
  )
    .then((resp) => res.status(200).send(resp.rows))
    .catch((e) => res.status(400).send(e));
});

export default router;
