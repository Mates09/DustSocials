import express from "express";
import { protectRoute } from "../middleware/protectRoute.js";
import {
  getNotifications,
  deleteNotification,
} from "../controllers/notification.controller.js";

const router = express.Router();

router.get("/", protectRoute, getNotifications);
router.delete("/", protectRoute, deleteNotification);

/* router.post("/like/:id", protectRoute, createPost);
router.post("/comment/:id", protectRoute, commentPost);
router.post("/", protectRoute, deletePost); */

/* router.get("/profile/:username", protectRoute, getUserProfile);
router.post("/follow/:id", protectRoute, followUnfollowUser);
router.get("/suggested", protectRoute, getSuggestedUsers);
router.post("/update", protectRoute, updateUserProfile); */

export default router;
