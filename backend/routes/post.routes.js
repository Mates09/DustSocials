import express from "express";
import { protectRoute } from "../middleware/protectRoute.js";
import {
  createPost,
  likeUnlikePost,
  deletePost,
  commentPost,
} from "../controllers/post.controller.js";

const router = express.Router();

router.post("/create", protectRoute, createPost);
router.post("/like/:id", protectRoute, likeUnlikePost);
router.post("/delete/:id", protectRoute, deletePost);
router.post("/comment/:id", protectRoute, commentPost);
/* router.post("/like/:id", protectRoute, createPost);
router.post("/comment/:id", protectRoute, commentPost);
router.post("/", protectRoute, deletePost); */

/* router.get("/profile/:username", protectRoute, getUserProfile);
router.post("/follow/:id", protectRoute, followUnfollowUser);
router.get("/suggested", protectRoute, getSuggestedUsers);
router.post("/update", protectRoute, updateUserProfile); */

export default router;
