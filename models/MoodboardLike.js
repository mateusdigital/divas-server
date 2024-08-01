// -----------------------------------------------------------------------------
const mongoose = require("mongoose");

// -----------------------------------------------------------------------------
const MoodboardLikeSchema = new mongoose.Schema({
  // DB
  owner: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true }, // Who made the comment
  // Info
  targetUser:      { type: mongoose.Schema.Types.ObjectId, ref: "User",      required: true }, // The person that was commented.
  targetMoodboard: { type: mongoose.Schema.Types.ObjectId, ref: "Moodboard", required: true }, // The moodboard that was commented.
});

// -----------------------------------------------------------------------------
const MoodboardLike = mongoose.model("MoodboardLike", MoodboardLikeSchema);

// -----------------------------------------------------------------------------
module.exports = MoodboardLike;
