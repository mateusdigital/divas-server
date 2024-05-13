
// -----------------------------------------------------------------------------
const mongoose = require("mongoose");

// -----------------------------------------------------------------------------
const CommentItemSchema = new mongoose.Schema({
  // DB
  owner: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true }, // Who made the like
  // Info
  targetUser:      { type: mongoose.Schema.Types.ObjectId, ref: "User",      required: true }, // The person that was liked.
  targetMoodboard: { type: mongoose.Schema.Types.ObjectId, ref: "Moodboard", required: true }, // The moodboard that was liked.
  //
  content: { type: String, required: true },
});

// -----------------------------------------------------------------------------
const MoodboardItem = mongoose.model("MoodboardItem", CommentItemSchema);

// -----------------------------------------------------------------------------
module.exports = MoodboardItem;
