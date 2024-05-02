//----------------------------------------------------------------------------//
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
//  File      : MoodboardItemRoutes.js                                        //
//  Project   : divas-server                                                  //
//  Date      : 2024-05-02                                                    //
//  License   : See project's COPYING.TXT for full info.                      //
//  Author    : mateus.digital <hello@mateus.digital>                         //
//  Copyright : mateus.digital - 2024                                         //
//                                                                            //
//  Description :                                                             //
//                                                                            //
//----------------------------------------------------------------------------//

// -----------------------------------------------------------------------------
const express = require("express");
const router  = express.Router();
const { StatusCodes } = require("http-status-codes");
// -----------------------------------------------------------------------------
const Debug = require("../helpers/Debug");
// -----------------------------------------------------------------------------
const MoodboardItem = require("../models/MoodboardItem");

// -----------------------------------------------------------------------------
// Route: POST - /moodboard-item - Create a new Moodboard
router.post("/moodboard-items/", async (req, res)=>{
  try {
    const moodboard_item = await MoodboardItem.create(req.body);
    res.status(StatusCodes.CREATED).json(moodboard_item);
  } catch (error) {
    debugger;
    res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({ message: error.message });
  }
});

// -----------------------------------------------------------------------------
// Route: GET - /moodboard-items - Get all Moodboard Items
router.get("/moodboard-items/", async (req, res) => {
  try {
    const moodboard_items = await MoodboardItem.find();

    Debug.LogJson(moodboard_items);

    res.json(moodboard_items);
  } catch (error) {
    debugger;
    res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({ message: error.message });
  }
});

// -----------------------------------------------------------------------------
// Route: GET - /moodboard-items/:id - Get a specific Moodboard Item by ID
router.get("/moodboard-items/:id", async (req, res)=>{
  try {
    const moodboard_item = await MoodboardItem.findById(req.params.id);
    if (!moodboard_item) {
      return res.status(StatusCodes.NOT_FOUND).json({ message: "Moodboard Item not found" });
    }

    Debug.LogJson(moodboard_item);
    res.json(moodboard_item);
  } catch (error) {
    debugger;
    res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({ message: error.message });
  }
});

// -----------------------------------------------------------------------------
// Route: Post /moodboard-items/ids/ - Get multiple moodboard by an array of IDs
router.post("/moodboard-items/ids/", async (req, res) => {
  try {
    const ids = req.body.ids;
    const moodboard_items = await MoodboardItem.find({ _id: { $in: ids } });

    Debug.LogJson(moodboard_items);

    res.json(moodboard_items);
  } catch (error) {
    debugger;
    res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({ message: error.message });
  }
});

// -----------------------------------------------------------------------------
module.exports = router;
