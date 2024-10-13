import User from "../models/user.model.js";
import Notification from "../models/notification.modej.js";
import bcrypt from "bcryptjs";
import { v2 as cloudinary } from "cloudinary";
import Post from "../models/post.model.js";

export const createPost = async (req, res) => {
  try {
    const { text } = req.body;
    let { img } = req.body;
    const userId = req.user._id.toString();

    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({ error: "User not found" });
    }

    if (!img && !text) {
      return res.status(404).json({ error: "Post must have image or text " });
    }

    if (img) {
      const uploadResponse = await cloudinary.uploader.upload(img);
      img = uploadResponse.secure_url;
    }

    const newPost = new Post({
      user: userId,
      text,
      img,
    });

    await newPost.save();
    return res.status(200).json(newPost);
  } catch (err) {
    console.log("create post ", err);
    res.status(500).json({ error: "server error" });
  }
};

export const deletePost = async (req, res) => {
  try {
    const post = await Post.findById(req.params.id);
    const userId = req.user._id;

    if (!post) {
      return res.status(500).json({ error: "Post not found" });
    }

    if (post.user.toString() !== userId.toString()) {
      return res.status(500).json({ error: "This is not your post" });
    }

    if (post.img) {
      await cloudinary.uploader.destroy(
        post.img.split("/").pop().split(".")[0]
      );
    }

    await Post.findByIdAndDelete(req.params.id);
    return res.status(200).json({ messege: "Post deleted" });
  } catch (err) {
    console.log("delete post err ", err);
    res.status(500).json({ error: "server error" });
  }
};

export const commentPost = async (req, res) => {
  try {
    const { text } = req.body;
    const postId = req.params.id;
    const userId = req.user._id;
    const post = await Post.findById(postId);

    if (!post) {
      return res.status(500).json({ error: "Post not found" });
    }

    if (!userId) {
      return res.status(500).json({ error: "user not found" });
    }

    if (!text) {
      return res.status(500).json({ error: "text required" });
    }

    const comment = { user: userId, text };

    post.comments.push(comment);

    await post.save();

    return res.status(200).json(post);
  } catch (err) {
    console.log("delete post err ", err);
    res.status(500).json({ error: "server error" });
  }
};

export const likeUnlikePost = async (req, res) => {
  try {
    const userId = req.user._id;
    const { id: postId } = req.params;

    const post = await Post.findById(postId);

    if (!post) {
      return res.status(404).json({ error: "Post not found" });
    }

    const userLikedPost = post.likes.includes(userId);

    if (userLikedPost) {
      // Unlike post
      await Post.updateOne({ _id: postId }, { $pull: { likes: userId } });
      await User.updateOne({ _id: userId }, { $pull: { likedPosts: postId } });

      const updatedLikes = post.likes.filter(
        (id) => id.toString() !== userId.toString()
      );
      res.status(200).json(updatedLikes);
    } else {
      // Like post
      post.likes.push(userId);
      await User.updateOne({ _id: userId }, { $push: { likedPosts: postId } });
      await post.save();

      const notification = new Notification({
        from: userId,
        to: post.user,
        type: "like",
      });
      await notification.save();

      const updatedLikes = post.likes;
      res.status(200).json(updatedLikes);
    }
  } catch (error) {
    console.log("Error in likeUnlikePost controller: ", error);
    res.status(500).json({ error: "Internal server error" });
  }
};
