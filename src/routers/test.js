import express from "express";

const router = new express.Router();


router.get("/test", async (req, res) => {
  res.send("TEST GET");
});

router.post("/test", async (req, res) => {
  res.send("TEST POST");
});

router.patch("/test", async (req, res) => {
  res.send("TEST PATCH");
});

router.delete("/test", async (req, res) => {
  res.send("TEST DELETE");
});

export default router;
