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

const upload = multer({
  dest: 'files',
  limits: {
      fileSize: 1000000000
  }
})

// Upload new file
router.post("/file/upload", auth.auth, upload.single('file'), async (req, res) => {
  if (req.user.rows.length == 0) {
    return res.status(401).send({ error: "Authenticate please!" });
  }

  const checkedValues = {
    id: uuidv4(),
    name: req.file.originalname,
    mimetype: req.file.mimetype,
    user_id: req.user.rows[0]._id,
    filepath: req.file.path
  };

  return query(req.ip, "INSERT INTO files (_id, _name, mimetype, user_id, filepath) VALUES ($1, $2, $3, $4, $5)", [checkedValues.id, checkedValues.name, checkedValues.mimetype, checkedValues.user_id, checkedValues.filepath])
    .then((resp) => res.status(201).send({"id": checkedValues.id, resp}))
    .catch((e) => res.status(400).send(e));
});

// Read all files for current user
router.get("/files", auth.auth, async (req, res) => {
  if (req.user.rows.length == 0) {
    return res.status(401).send({ error: "Authenticate please!" });
  }
  
  query(req.ip, "SELECT _id, _name, mimetype, filepath FROM files WHERE user_id = $1", [req.user.rows[0]._id]).then((resp) => res.status(200).send(resp.rows)).catch((e) => res.status(400).send(e));
})

// Get file
router.get("/file", auth.auth, async (req, res) => {
  const values = Object.keys(req.body);
  const allowedValues = ["id"];
  const isValidOperation = values.every((update) => allowedValues.includes(update));

  if (!isValidOperation) {
    return res.status(400).send({ error: "invalid values!" });
  }
  if (req.user.rows.length == 0) {
    return res.status(401).send({ error: "Authenticate please!" });
  }
  
  query(req.ip, "SELECT * FROM files WHERE _id = $1 AND user_id = $2", [req.body.id, req.user.rows[0]._id])
    .then((file) => res.status(200).sendFile(path.join(path.resolve(), file.rows[0].filepath)))
    .catch((e) => res.status(404).send(e));
})

// Delete file
router.delete("/file", auth.auth, async (req, res) => {
  const values = Object.keys(req.body);
  const allowedValues = ["id"];
  const isValidOperation = values.every((update) => allowedValues.includes(update));

  if (!isValidOperation) {
    return res.status(400).send({ error: "invalid values!" });
  }
  if (req.user.rows.length == 0) {
    return res.status(401).send({ error: "Authenticate please!" });
  }

  query(req.ip, "SELECT * FROM files WHERE _id = $1 AND user_id = $2", [req.body.id, req.user.rows[0]._id])
    .then((file) => {
      if (file.rows.length == 0) {
        return res.status(404).send({ error: "File Not Found!" });
      }
      fs.unlink(file.rows[0].filepath, (err) => {
        if (err) throw err;
      })
    })
    .catch((e) => res.status(500).send(e));

  return query(req.ip, "DELETE FROM files WHERE _id = $1 AND user_id = $2", [req.body.id, req.user.rows[0]._id])
    .then((resp) => res.status(200).send(resp.rows[0]))
    .catch((e) => res.status(500).send(e));
});

// Update file
router.patch("/file", auth.auth, async (req, res) => {
  const values = Object.keys(req.body);
  const allowedValues = ["id", "name"];
  const isValidOperation = values.every((update) => allowedValues.includes(update));

  if (!isValidOperation) {
    return res.status(400).send({ error: "invalid values!" });
  }
  if (req.user.rows.length == 0) {
    return res.status(401).send({ error: "Authenticate please!" });
  }

  return query(req.ip, "UPDATE files SET _name = $1 WHERE _id = $2 AND user_id = $3", [req.body.name, req.body.id, req.user.rows[0]._id])
    .then((resp) => res.status(200).send(resp))
    .catch((e) => res.status(500).send(e));
});

export default router;
