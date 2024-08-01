// -----------------------------------------------------------------------------
const express          = require("express");
const router           = express.Router();
const {StatusCodes}    = require("http-status-codes");
// -----------------------------------------------------------------------------
const Debug            = require("../helpers/Debug");
// -----------------------------------------------------------------------------
const Moodboard = require("../models/Moodboard");
const MoodboardLike = require("../models/MoodboardLike");
const User = require("../models/User");
// -----------------------------------------------------------------------------
const Endpoints        = require("../divas-shared/shared/API/Endpoints");


// -----------------------------------------------------------------------------
// Route: POST /like - Create a new Like
router.post(Endpoints.MoodboardLike.Toggle, async (req, res) => {
  try {
    const { ownerId, moodboardId, targetUserId, } = req.body;

    //
    const moodboard = await Moodboard.findById(moodboardId);
    if(!moodboard) {
      res
        .status(StatusCodes.BAD_REQUEST)
        .json({message: "Invalid moodboard id"});
      return
    }

    const owner = await User.findById(ownerId);
    if(!owner) {
      res
        .status(StatusCodes.BAD_REQUEST)
        .json({message: "Invalid Owner User id"});
      return
    }

    const targetUser = await User.findById(ownerId);
    if(!targetUser) {
      res
        .status(StatusCodes.BAD_REQUEST)
        .json({message: "Invalid Target User id"});
        return
    }

    //
    const existing_like = await MoodboardLike.findOne({
      owner: ownerId,
      targetMoodboard: moodboardId
    });

    const result = { likesCount: 0, isLiked: false };

    if (existing_like) {
      await MoodboardLike.deleteOne({ _id: existing_like._id });
      moodboard.likesCount -= 1;
      result.isLiked = false;
    }
    else {
      const newLike = new MoodboardLike({
        owner: owner,
        targetMoodboard: moodboard,
        targetUser: targetUser
      });

      await newLike.save();

      moodboard.likesCount += 1;
      result.isLiked = true;
    }

    result.likesCount = moodboard.likesCount;
    await moodboard.save();

    res
      .status(StatusCodes.OK)
      .json(result);
  }
  catch (error) {
    return res
      .status(StatusCodes.INTERNAL_SERVER_ERROR)
      .json({message: error.message});
  }
});

// -----------------------------------------------------------------------------
// Route: GET /like - Get all like items
router.get("/like", async (req, res) => {
  try {
    const like_items = await Like.find();

    Debug.LogJson(like_items);

    res.json(like_items);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// -----------------------------------------------------------------------------
// Route: GET /like/:userId - Get all likes from a user with id
router.get("/like/:userId", async (req, res) => {
  try {
    const likes = await Like.find({ owner: req.params.userId });

    if (!likes) {
      return res.status(404).json({ message: "User not found" });
    }

    const moodboard_ids = likes.map((like)=>{ return like.targetMoodboard; });
    const moodboards    = await Moodboard.find({ _id: { $in: moodboard_ids } });

    Debug.LogJson(likes);
    Debug.LogJson(moodboards);

    res.json(moodboards);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});


// -----------------------------------------------------------------------------
module.exports = router;
