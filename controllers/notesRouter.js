const express = require("express");
const Joi = require("joi");

const { asyncWrapper } = require("../utils/errorHandler");
const { authMiddleware } = require("../middleware/authMidlleware");
const { Notes } = require("../models/notesModel");
const router = express.Router();

router.get(
  "/",
  authMiddleware,
  asyncWrapper(async (req, res, next) => {
    const { _id } = req.user;
    const { offset, limit } = req.body;
    const notes = await Notes.find({ userId: _id });
    res.status(200).json({
      offset,
      limit,
      count: notes.slice(offset, limit + offset).length,
      notes: notes.slice(offset, limit + offset),
    });
  })
);
router.post(
  "/",
  authMiddleware,
  asyncWrapper(async (req, res, next) => {
    const { text } = req.body;
    const schema = Joi.object({
      text: Joi.string().min(3).required(),
    });
    await schema.validateAsync(req.body);

    const note = new Notes({
      completed: false,
      userId: req.user._id,
      text,
    });
    await note.save();

    res.status(200).json({ message: "Success" });
  })
);

router.get(
  "/:id",
  authMiddleware,
  asyncWrapper(async (req, res) => {
    const { id } = req.params;
    const notes = await Notes.findById({ _id: id, userId: req.user._id });
    res.status(200).json({ notes });
  })
);
router.put(
  "/:id",
  authMiddleware,
  asyncWrapper(async (req, res) => {
    const { id } = req.params;
    const { text } = req.body;
    await Notes.findOneAndUpdate(
      { _id: id, userId: req.user._id },
      { $set: { text } }
    );
    res.status(200).json({ message: "Success" });
  })
);
router.patch(
  "/:id",
  authMiddleware,
  asyncWrapper(async (req, res) => {
    const { id } = req.params;
    const note = await Notes.findById({ _id: id });
    await Notes.findByIdAndUpdate(
      { _id: id },
      { $set: { completed: !note.completed } }
    );
    res.status(200).json({ message: "Success" });
  })
);
router.delete(
  "/:id",
  authMiddleware,
  asyncWrapper(async (req, res) => {
    const { id } = req.params;
    await Notes.findOneAndRemove({ _id: id, userId: req.user._id });
    res.status(200).json({ message: "Success" });
  })
);
module.exports = {
  notesRouter: router,
};
