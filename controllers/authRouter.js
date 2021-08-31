const express = require("express");
const jwt = require("jsonwebtoken");
const bcrypt = require("bcrypt");
const router = express.Router();

const { asyncWrapper } = require("../utils/errorHandler");
const { UserModel } = require("../models/userModel");

router.post(
  "/register",
  asyncWrapper(async (req, res) => {
    const { username, password } = req.body;
    if (!username || !password) {
      res.status(400).json({ message: "Bad request" });
    }
    const user = new UserModel({
      username,
      password: await bcrypt.hash(password, 10),
    });
    await user.save();

    res.json({ status: "Success" });
  })
);
router.post(
  "/login",
  asyncWrapper(async (req, res) => {
    const { username, password } = req.body;

    const user = await UserModel.findOne({ username });

    if (!user) {
      return res.status(401).json({ message: "Wrong username or password" });
    }

    if (!(await bcrypt.compare(password, user.password))) {
      return res.status(401).json({ message: "Wrong password" });
    }

    const token = jwt.sign(
      {
        _id: user._id,
        username: user.username,
      },
      "secretRDNode.js"
    );
    res.json({
      message: "Success",
      jwt_token: token,
    });
  })
);
module.exports = {
  authRouter: router,
};
