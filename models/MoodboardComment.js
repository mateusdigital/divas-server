// -----------------------------------------------------------------------------
const mongoose = require("mongoose");

// -----------------------------------------------------------------------------
const MoodboardCommentSchema = new mongoose.Schema({
  // DB
  owner: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true }, // Who made the comment
  // Info
  targetUser:      { type: mongoose.Schema.Types.ObjectId, ref: "User",      required: true }, // The person that was liked.
  targetMoodboard: { type: mongoose.Schema.Types.ObjectId, ref: "Moodboard", required: true }, // The moodboard that was liked.
  // Content
  content: { type: String, required: true }, // What was commented...

});

// -----------------------------------------------------------------------------
const MoodboardComment = mongoose.model("MoodboardComment", MoodboardCommentSchema);

// -----------------------------------------------------------------------------
module.exports = MoodboardComment;
