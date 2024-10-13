import User from "../models/user.model.js";
import Notification from "../models/notification.modej.js";
import bcrypt from "bcryptjs";
import { v2 as cloudinary } from "cloudinary";
import Post from "../models/post.model.js";

export const getNotifications = async (req, res) => {
  try {
    const userId = req.user._id;
    const notifications = await Notification.find({ to: userId }).populate({
      path: "from",
      select: "username profileImg",
    });

    await Notification.updateMany({ to: userId }, { read: true });
    res.status(200).json(notifications);
  } catch (error) {
    console.log("load notifications error: ", error);
    res.status(500).json({ error: "Internal server error" });
  }
};

export const deleteNotification = async (req, res) => {
  try {
    const userId = req.user._id;
    await Notification.deleteMany({ to: userId });
    res.status(200).json({ messge: "Notification deleted" });
  } catch (error) {
    console.log("delete notification error: ", error);
    res.status(500).json({ error: "Internal server error" });
  }
};
