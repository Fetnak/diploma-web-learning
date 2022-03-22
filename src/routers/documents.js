import express from "express";
import auth from "../middleware/auth.js";
import query from "../db/query.js";

const router = new express.Router();

// Create new document
router.post("/api/v1/documents", auth.teacher, async (req, res) => query(
  req.ip,
  "INSERT INTO documents (_name, document_id, subject_id, group_id, file_id) VALUES ($1, $2, $3, $4, $5)",
  [
    req.body.name,
    req.body.document_id,
    req.body.subject_id,
    req.body.group_id,
    req.body.file_id
  ]
)
  .then(() => res.status(201).send())
  .catch(() => res.status(400).send()));

// Read all documents
router.post("/api/v1/documents/read", auth.student, async (req, res) => {
  const textQuery = "SELECT documents._id, documents._name, document_id, subject_id, group_id, file_id, groups._name AS group_name, subjects._name AS subject_name, files.mimetype, files._name AS file_name FROM documents LEFT JOIN groups ON documents.group_id = groups._id LEFT JOIN subjects ON documents.subject_id = subjects._id LEFT JOIN files ON documents.file_id = files._id";
  if (req.body.document_id || !(req.body.document_id === "")) {
    return query(req.ip, textQuery.concat(" WHERE document_id = $1"), [
      req.body.document_id
    ])
      .then((resp) => res.status(200).send(resp.rows))
      .catch(() => res.status(400).send());
  }
  return query(req.ip, textQuery.concat(" WHERE document_id IS NULL"))
    .then((resp) => res.status(200).send(resp.rows))
    .catch(() => res.status(400).send());
});

// Read root document
router.post("/api/v1/documents/read/root", auth.student, async (req, res) => query(req.ip, "SELECT document_id FROM documents WHERE _id = $1", [
  req.body.id
])
  .then((resp) => res.status(200).send(resp.rows[0]))
  .catch(() => res.status(400).send()));

// // Read all documents for current user's group
// router.get("/api/v1/documents/read", auth.student, async (req, res) => {
//   query(
//     req.ip,
//     "SELECT _id, _name, document_id, subject_id, file_id FROM documents WHERE group_id = (SELECT group_id FROM users WHERE _id = $1)",
//     [req.session.userId]
//   )
//     .then((resp) => res.status(200).send(resp.rows))
//     .catch((e) => res.status(400).send(e));
// });

// Update document
router.patch("/api/v1/documents", auth.teacher, async (req, res) => {
  query(
    req.ip,
    "UPDATE documents SET (_name, subject_id, group_id, file_id) = ($1, $2, $3, $4) WHERE _id = $5",
    [
      req.body.name,
      req.body.subject_id,
      req.body.group_id,
      req.body.file_id,
      req.body.id
    ]
  )
    .then(() => res.status(200).send())
    .catch(() => res.status(400).send());
});

// Delete document
router.post("/api/v1/documents/delete", auth.teacher, async (req, res) => {
  query(req.ip, "DELETE FROM documents WHERE _id = $1", [req.body.id])
    .then(() => res.status(200).send())
    .catch(() => res.status(400).send());
});

export default router;
