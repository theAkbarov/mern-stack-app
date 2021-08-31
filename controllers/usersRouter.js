const express = require("express");
const jwt = require("jsonwebtoken");
const bcrypt = require("bcrypt");
const { asyncWrapper } = require("../utils/errorHandler");
const { authMiddleware } = require("../middleware/authMidlleware");
const { UserModel } = require("../models/userModel");
const router = express.Router();

router.get(
  "/me",
  authMiddleware,
  asyncWrapper(async (req, res, next) => {
    const user = await UserModel.find({ _id: req.user._id });
    res.status(200).json({ user });
  })
);
router.delete(
  "/me",
  authMiddleware,
  asyncWrapper(async (req, res, next) => {
    await UserModel.findOneAndRemove({ _id: req.user._id });
    res.status(200).json({
      message: "Success",
    });
  })
);
router.patch(
  "/me",
  authMiddleware,
  asyncWrapper(async (req, res, next) => {
    const { oldPassword, newPassword } = req.body;
    const user = await UserModel.findOne({ _id: req.user._id });
    if (!(await bcrypt.compare(oldPassword, user.password))) {
      return res.status(401).json({ message: "Wrong password" });
    }
    await UserModel.findByIdAndUpdate(
      { _id: req.user._id },
      { $set: { password: await bcrypt.hash(newPassword, 10) } }
    );
    res.status(200).json({ message: "Success" });
  })
);

module.exports = {
  usersRouter: router,
};
