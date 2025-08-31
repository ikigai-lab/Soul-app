import express from "express";
import { getPosts, createPost, getComments, addComment } from "../controllers/postController.js";

const router = express.Router();

router.get("/", getPosts);
router.post("/", createPost);
router.get("/:postId/comments", getComments);
router.post("/:postId/comments", addComment);

export default router;
