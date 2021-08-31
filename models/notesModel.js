const mongoose = require("mongoose");

const Notes = mongoose.model(
  "Notes",
  mongoose.Schema({
    userId: {
      type: String,
      required: true,
    },
    completed: Boolean,
    text: {
      type: String,
      required: true,
    },
    createdDate: {
      type: Date,
      default: Date.now(),
    },
  })
);

module.exports = {
  Notes,
};
