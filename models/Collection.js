
// -----------------------------------------------------------------------------
const mongoose = require("mongoose");

// -----------------------------------------------------------------------------
const CollectionSchema = new mongoose.Schema({
  // DB
  owner: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true }, // Who created this collection.
  // Info
  title:       { type: String, required: true }, // Name of this collection.
  description: { type: String, required: true }, // Description of this collection.

  moodboards: { type: mongoose.Schema.Types.ObjectId, ref: "Moodboard", required: true },
});

// -----------------------------------------------------------------------------
const Collection = mongoose.model("Collection", CollectionSchema);

// -----------------------------------------------------------------------------
module.exports = Collection;