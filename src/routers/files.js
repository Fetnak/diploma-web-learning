import express from "express";
import multer from "multer";
import fs from "fs";
import path from "path";
import auth from "../middleware/auth.js";
import query from "../db/query.js";

const router = new express.Router();

const upload = multer({
  dest: "files",
  limits: {
    fileSize: 52428800
  }
});

// Upload new file
router.post("/api/v1/file/upload", upload.single("file"), auth.student, async (req, res) => {
  console.log(req.file);
  return query(req.ip, "INSERT INTO files (_name, mimetype, user_id, filepath) VALUES ($1, $2, $3, $4)", [req.file.originalname, req.file.mimetype, req.session.userId, req.file.path])
    .then((resp) => res.status(201).send(console.log(resp)))
    .catch((error) => res.status(400).send(console.log(error)));
});

// Read all files for current user
router.get("/api/v1/files", auth.student, async (req, res) => query(req.ip, "SELECT _id, _name, mimetype, filepath, _public FROM files WHERE user_id = $1", [req.session.userId]).then((resp) => res.status(200).send(resp.rows)).catch((e) => res.status(400).send(e)));

// Get file
router.post("/api/v1/file/download", auth.student, async (req, res) => query(req.ip, "SELECT * FROM files WHERE _id = $1 AND (user_id = $2 OR _public = true)", [req.body.id, req.session.userId])
  .then((file) => res.status(200).sendFile(path.join(path.resolve(), file.rows[0].filepath)))
  .catch((e) => res.status(404).send(e)));

// Delete file
router.post("/api/v1/file/delete", auth.student, async (req, res) => query(req.ip, "SELECT * FROM files WHERE _id = $1 AND user_id = $2", [req.body.id, req.session.userId])
  .then((file) => {
    if (file.rows.length === 0) {
      return res.status(404).send({ error: "File Not Found!" });
    }
    fs.unlink(file.rows[0].filepath, (err) => {
      if (err) throw err;
    });
    return query(req.ip, "DELETE FROM files WHERE _id = $1 AND user_id = $2", [req.body.id, req.session.userId])
      .then(() => res.status(200).send())
      .catch(() => res.status(400).send());
  })
  .catch(() => res.status(400).send()));

// Update file
router.patch("/api/v1/file", auth.student, async (req, res) => query(req.ip, "UPDATE files SET (_name, _public) = ($1, $2) WHERE _id = $3 AND user_id = $4", [req.body.name, req.body.public, req.body.id, req.session.userId])
  .then(() => res.status(200).send())
  .catch(() => res.status(400).send()));

export default router;
