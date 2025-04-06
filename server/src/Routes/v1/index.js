import express from "express";
import { createTalkingHead, getSubjectScript, getThisApi, helper, streamVideo } from "../../Controller/index.js";
import fs from "fs";

const router = express.Router();

router.get("/", (req, res) => {
  res.send(`<h1>Hello from the microservice!</h1>`);
});

router.post("/subject", getSubjectScript);
router.post("/script", getThisApi); // parameters required: topic, grade, level
router.post("/talkinghead", helper); //
router.get("/stream", streamVideo);


export default router;
