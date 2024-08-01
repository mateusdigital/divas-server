// -----------------------------------------------------------------------------
const express          = require("express");
const router           = express.Router();
const {StatusCodes}    = require("http-status-codes");
// -----------------------------------------------------------------------------
const Debug            = require("../helpers/Debug");
// -----------------------------------------------------------------------------
const MoodboardComment = require("../models/MoodboardComment");
// -----------------------------------------------------------------------------
const Endpoints        = require("../divas-shared/shared/API/Endpoints");


// -----------------------------------------------------------------------------
// POST - Create a new Moodboard Item
router.post(Endpoints.MoodboardComment.Create, async (req, res) => {
  try {
    const moodboard_comment = await MoodboardComment.create(req.body);
    return res
      .status(StatusCodes.CREATED)
      .json(moodboard_comment);
  }
  catch (error) {
    debugger;
    return res
      .status(StatusCodes.INTERNAL_SERVER_ERROR)
      .json({message: error.message});
  }
});


//
// GET
//

// -----------------------------------------------------------------------------
// GET - Get all Moodboard Items
router.get(Endpoints.MoodboardComment.GetAll, async (req, res) => {
  try {
    const moodboard_comments = await MoodboardComment.find();
    Debug.LogJson(moodboard_comments);
    
    return res.json(moodboard_comments);
  }
  catch (error) {
    debugger;
    return res
      .status(StatusCodes.INTERNAL_SERVER_ERROR)
      .json({message: error.message});
  }
});


// -----------------------------------------------------------------------------
module.exports = router;
