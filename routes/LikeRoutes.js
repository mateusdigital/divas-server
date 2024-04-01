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
const User       = require("../models/User");
const DesignItem = require("../models/DesignItem");
const Like       = require("../models/Like");

// -----------------------------------------------------------------------------
// Route: POST /like - Create a new Like
router.post("/like", async (req, res) => {
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
// Route: GET /like:userId - Get a specific like item by ID
router.get("/like/:userId", async (req, res) => {
  try {
    const likes = await Like.find({ owner: req.params.userId });

    if (!likes) {
      return res.status(404).json({ message: "Design item not found" });
    }

    const design_ids   = likes.map((like)=> { return like.targetDesignItem; });
    const design_items = await DesignItem.find({ _id: { $in: design_ids } });

    Debug.LogJson(likes);
    Debug.LogJson(design_items);

    res.json(design_items);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});


// -----------------------------------------------------------------------------
module.exports = router;
