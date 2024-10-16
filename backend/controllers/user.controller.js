import User from "../models/user.model.js";
import Notification from "../models/notification.modej.js";
import bcrypt from "bcryptjs";
import { v2 as cloudinary } from "cloudinary";

export const getUserProfile = async (req, res) => {
  console.log("req.params: ", req.params);
  const { username } = req.params;

  try {
    const user = await User.findOne({ username }).select("-password");

    if (!user) {
      return res.status(404).json({ error: "User not found" });
    }

    res.status(200).json(user);
  } catch (err) {
    console.log("server error ", err);
    res.status(500).json({ error: "server error" });
  }
};

export const followUnfollowUser = async (req, res) => {
  try {
    console.log("req.params: ", req.params);
    const { id } = req.params;

    const userToModify = await User.findById(id);
    const currentuser = await User.findById(req.user._id);

    if (id === req.user._id.toString()) {
      return res.status(400).json({ error: "you cannot follow yourself" });
    }

    if (!userToModify || !currentuser) {
      return res.status(500).json({ error: "User not found" });
    }

    const isFollowing = currentuser.following.includes(id);

    if (isFollowing) {
      await User.findByIdAndUpdate(id, { $pull: { followers: req.user._id } });
      await User.findByIdAndUpdate(req.user._id, { $pull: { following: id } });
      res.status(200).json({ message: "User unfolowed" });
    } else {
      await User.findByIdAndUpdate(id, { $push: { followers: req.user._id } });
      await User.findByIdAndUpdate(req.user._id, { $push: { following: id } });

      const newNotification = new Notification({
        type: "follow",
        from: req.user._id,
        to: userToModify._id,
      });

      await newNotification.save();

      res.status(200).json({ message: "User followed" });
    }
  } catch (err) {
    console.log("server error ", err);
    res.status(500).json({ error: "server error" });
  }
};

export const getSuggestedUsers = async (req, res) => {
  console.log("req.user._id: ", req.user);
  const userId = req.user._id;

  try {
    const usersFollowedByMe = await User.findById(userId).select("following");

    const users = await User.aggregate([
      {
        $match: {
          _id: { $ne: userId },
        },
      },
      { $sample: { size: 10 } },
    ]);

    const filteredUsers = users.filter(
      (user) => !usersFollowedByMe.following.includes(user._id)
    );
    const suggestedUsers = filteredUsers.slice(0, 4);

    suggestedUsers.forEach((user) => (user.password = null));

    res.status(200).json(suggestedUsers);
  } catch (err) {
    console.log("suggestedUsers err ", err);
    res.status(500).json({ error: "server error" });
  }
};

export const updateUserProfile = async (req, res) => {
  const { fullName, email, username, currentPassword, newPassword, bio, link } =
    req.body;
  let { profileImg, coverImg } = req.body;

  const userId = req.user._id;
  let user = await User.findById(userId);

  try {
    if (!user) {
      console.log("user not found");
      res.status(404).json({ error: "user not found" });
    }

    if (
      (!newPassword && currentPassword) ||
      (!currentPassword && newPassword)
    ) {
      res.status(400).json({ error: "both password need to be spewcified" });
    }

    if (currentPassword && newPassword) {
      const isMatch = await bcrypt.compare(currentPassword, user.password);
      if (!isMatch) {
        return res.status(400).json({ error: "Current password is incorret" });
      }
      if (newPassword.length < 6) {
        return res.status(400).json({ error: "Password is short" });
      }

      const salt = await bcrypt.genSalt(10);
      user.password = await bcrypt.hash(newPassword, salt);
    }

    if (profileImg) {
      if (user.profileImg) {
        await cloudinary.uploader.destroy(
          user.profileImg.split("/").pop().split(".")[0]
        );
      }
      const uploadresponse = await cloudinary.uploader.upload(profileImg);
      profileImg = uploadresponse.secure_url;
    }

    if (coverImg) {
      if (user.coverImg) {
        await cloudinary.uploader.destroy(
          user.coverImg.split("/").pop().split(".")[0]
        );
      }
      const uploadresponse = await cloudinary.uploader.upload(coverImg);
      coverImg = uploadresponse.secure_url;
    }

    user.fullName = fullName || user.fullName;
    user.email = email || user.email;
    user.username = username || user.username;
    user.bio = bio || user.bio;
    user.link = link || user.link;
    user.profileImg = profileImg || user.profileImg;
    user.coverImg = coverImg || user.coverImg;

    user = await user.save();

    user.password = null;
    return res.status(200).json(user);
  } catch (err) {
    console.log("update err ", err);
    res.status(500).json({ error: "server error" });
  }
};

export const getFollowingUsers = async (req, res) => {
  console.log("req.user._id: ", req.user);
  const userId = req.user._id;

  try {
    const usersFollowedByMe = await User.findById(userId).select("following");

    const users = await User.aggregate([
      {
        $match: {
          _id: { $ne: userId },
        },
      },
      { $sample: { size: 10 } },
    ]);

    const filteredUsers = users.filter((user) =>
      usersFollowedByMe.following.includes(user._id)
    );
    const suggestedUsers = filteredUsers.slice(0, 4);

    suggestedUsers.forEach((user) => (user.password = null));

    res.status(200).json(suggestedUsers);
  } catch (err) {
    console.log("suggestedUsers err ", err);
    res.status(500).json({ error: "server error" });
  }
};
