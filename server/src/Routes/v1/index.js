import express from "express";

const router = express.Router();

router.get("/", (req, res) => {
  res.send(`<h1>Hello from the microservice!</h1>`);
});

router.post("/subject", );
router.post("")

export default router;
