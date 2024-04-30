//~---------------------------------------------------------------------------//
//                               *       +                                    //
//                         '                  |                               //
//                     ()    .-.,="``"=.    - o -                             //
//                           '=/_       \     |                               //
//                        *   |  '=._    |                                    //
//                             \     `=./`,        '                          //
//                          .   '=.__.=' `='      *                           //
//                 +                         +                                //
//                      O      *        '       .                             //
//                                                                            //
//  File      : LikeRoutes.js                                                 //
//  Project   : divas-server                                                  //
//  Date      : 2024-04-01                                                    //
//  License   : See project's COPYING.TXT for full info.                      //
//  Author    : mateus.digital <hello@mateus.digital>                         //
//  Copyright : mateus.digital - 2024                                         //
//                                                                            //
//  Description :                                                             //
//                                                                            //
//---------------------------------------------------------------------------~//

// -----------------------------------------------------------------------------
const express = require("express");
const router = express.Router();
// -----------------------------------------------------------------------------
const Debug = require("../helpers/Debug");
// -----------------------------------------------------------------------------
const User      = require("../models/User");
const Moodboard = require("../models/Moodboard");
const Like      = require("../models/Like");

// -----------------------------------------------------------------------------
// Route: POST /like - Create a new Like
router.post("/like", async (req, res)=>{
  try {
    const like = await Like.create(req.body);
    await like.save();

    Debug.LogJson(like);

    res.status(201).json(like);
  } catch (error) {
    res.status(500).json({ message: error.message });
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
