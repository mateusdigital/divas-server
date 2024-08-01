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
const MoodboardItem = require("../models/MoodboardItem");

function _CheckMissingField(field, res, name) {

  if(!field) {
    res
      .status(StatusCodes.BAD_REQUEST)
      .json({message: `Missing fields: (${name})`});

    return true;
  }
  return false;
}

// -----------------------------------------------------------------------------
// POST - Create a new Moodboard Item
router.post(Endpoints.MoodboardComment.Create, async (req, res) => {
  try {
    const { owner, targetUser, targetMoodboard, content } = req.body;

    if ( _CheckMissingField(owner, res, "owner")
      || _CheckMissingField(targetUser, res, "user")
      || _CheckMissingField(targetMoodboard, res, "moodboard")
      || _CheckMissingField(content, res, "content")
    )
    {
      return;
    }

    // Create the comment.
    const moodboard_comment = await MoodboardComment.create({
      owner,
      targetUser,
      targetMoodboard,
      content
    });

    const populated = await MoodboardComment
      .findById(moodboard_comment._id)
      .populate('targetUser');

    const moodboard = await MoodboardItem.findByIdAndUpdate(
      targetMoodboard,
      { $inc: { commentsCount: 1 } },
      { new: true }
    );

    return res
      .status(StatusCodes.CREATED)
      .json(populated);
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
// GET - Get all Moodboard Comments
router.get(Endpoints.MoodboardComment.GetAll, async (req, res) => {
  try {
    const targetMoodboard = req.params.id;

    const moodboard_comments = await MoodboardComment
      .find({targetMoodboard})
      .populate("targetUser");

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
