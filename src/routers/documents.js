import express from "express";
import bcrypt from "bcryptjs";
import validator from "validator";
import query from "../db/query.js";
import multer from "multer";
import fs from "fs";
import auth from "../middleware/auth.js";
import { v4 as uuidv4 } from "uuid";
import path from "path";

const router = new express.Router();

// Create new document
router.post("/api/v1/documents/create", auth.auth, async (req, res) => {
  if (req.user.rows.length == 0) {
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

  return query(req.ip, "INSERT INTO documents (_id, _name, document_id, subject_id, group_id, file_id) VALUES ($1, $2, $3, $4, $5, $6)", [checkedValues.id, checkedValues.name, checkedValues.document_id, checkedValues.subject_id, checkedValues.group_id, checkedValues.file_id])
    .then((resp) => res.status(201).send({"id": checkedValues.id, resp}))
    .catch((e) => res.status(400).send(e));
});

// Read all documents for current user's group
router.get("/api/v1/documents/read", auth.auth, async (req, res) => {  
  query(req.ip, "SELECT _id, _name, document_id, subject_id, file_id FROM documents WHERE group_id = (SELECT group_id FROM users WHERE _id = $1)", [req.body.authData.userId]).then((resp) => res.status(200).send(resp.rows)).catch((e) => res.status(400).send(e));
  console.log(req.body);
  // query(req.ip, "SELECT _id, _name, document_id, subject_id, file_id FROM documents").then((resp) => {
  //   res.status(200).send(resp.rows)
  // }).catch((e) => res.status(400).send(e));
})

// // Read all documents (administraitor)
// router.get("/api/v1/documents/read", auth.auth, async (req, res) => {
//   if (req.user.rows.length == 0) {
//     return res.status(401).send({ error: "Authenticate please!" });
//   }
  
//   query(req.ip, "SELECT _id, _name, document_id, subject_id, group_id, file_id FROM documents").then((resp) => res.status(200).send(resp.rows)).catch((e) => res.status(400).send(e));
// })
// 
// // Get file
// router.get("/file", auth.auth, async (req, res) => {
//   const values = Object.keys(req.body);
//   const allowedValues = ["id"];
//   const isValidOperation = values.every((update) => allowedValues.includes(update));

//   if (!isValidOperation) {
//     return res.status(400).send({ error: "invalid values!" });
//   }
//   if (req.user.rows.length == 0) {
//     return res.status(401).send({ error: "Authenticate please!" });
//   }
  
//   query(req.ip, "SELECT * FROM files WHERE _id = $1 AND user_id = $2", [req.body.id, req.user.rows[0]._id])
//     .then((file) => res.status(200).sendFile(path.join(path.resolve(), file.rows[0].filepath)))
//     .catch((e) => res.status(404).send(e));
// })

// // Delete file
// router.delete("/api/v1/documents", auth.auth, async (req, res) => {
//   const values = Object.keys(req.body);
//   const allowedValues = ["id"];
//   const isValidOperation = values.every((update) => allowedValues.includes(update));

//   if (!isValidOperation) {
//     return res.status(400).send({ error: "invalid values!" });
//   }
//   if (req.user.rows.length == 0) {
//     return res.status(401).send({ error: "Authenticate please!" });
//   }

//   query(req.ip, "SELECT * FROM documents INNER JOIN files ON (documents.file_id = files._id) WHERE documents.file_id = $1, files.user_id = $2", [req.body.id, req.user.rows[0]._id])
//     .then((file) => {
//       if (file.rows.length == 0) {
//         return res.status(404).send({ error: "File Not Found!" });
//       }
//       fs.unlink(file.rows[0].filepath, (err) => {
//         if (err) throw err;
//       })
//     })
//     .catch((e) => res.status(500).send(e));

//   return query(req.ip, "DELETE FROM files WHERE _id = $1 AND user_id = $2", [req.body.id, req.user.rows[0]._id])
//     .then((resp) => res.status(200).send(resp.rows[0]))
//     .catch((e) => res.status(500).send(e));
// });

// // Update file
// router.patch("/file", auth.auth, async (req, res) => {
//   const values = Object.keys(req.body);
//   const allowedValues = ["id", "name"];
//   const isValidOperation = values.every((update) => allowedValues.includes(update));

//   if (!isValidOperation) {
//     return res.status(400).send({ error: "invalid values!" });
//   }
//   if (req.user.rows.length == 0) {
//     return res.status(401).send({ error: "Authenticate please!" });
//   }

//   return query(req.ip, "UPDATE files SET _name = $1 WHERE _id = $2 AND user_id = $3", [req.body.name, req.body.id, req.user.rows[0]._id])
//     .then((resp) => res.status(200).send(resp))
//     .catch((e) => res.status(500).send(e));
// });

export default router;
