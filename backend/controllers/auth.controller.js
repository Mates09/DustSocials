import express from "express";

const router = express.Router();

export const signup = async (req, res) => {
  res.json({
    data: "you just hit signup endpoint",
  });
};
export const login = async (req, res) => {
  res.json({
    data: "you just hit signup endpoint",
  });
};

export const logout = async (req, res) => {
  res.json({
    data: "you just hit signup endpoint",
  });
};

export default router;
