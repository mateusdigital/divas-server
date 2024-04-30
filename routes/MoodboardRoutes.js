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
//  File      : MoodboardRoutes.js                                           //
//  Project   : divas-server                                                  //
//  Date      : 2024-03-26                                                    //
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
const Moodboard = require("../models/Moodboard");
const User       = require("../models/User");


// -----------------------------------------------------------------------------
// Route: POST /moodboard - Create a new Moodboard
router.post("/moodboard/", async (req, res) => {
  try {
    const moodboard = await Moodboard.create(req.body);

    // Update the corresponding user document to include the new design item.
    await User.findByIdAndUpdate(
      moodboard.owner,
      { $push: { moodboards: moodboard._id } },
      { new: true }
    );

    res.status(201).json(moodboard);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// -----------------------------------------------------------------------------
// Route: GET /moodboard - Get all design items
router.get("/moodboard/", async (req, res) => {
  try {
    const moodboards = await Moodboard.find();

    Debug.LogJson(moodboards);

    res.json(moodboards);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// -----------------------------------------------------------------------------
// Route: GET /moodboard:id - Get a specific design item by ID
router.get("/moodboard/:id", async (req, res) => {
  try {
    const moodboard = await Moodboard.findById(req.params.id);
    if (!moodboard) {
      return res.status(404).json({ message: "Design item not found" });
    }

    Debug.LogJson(moodboard);

    res.json(moodboard);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// -----------------------------------------------------------------------------
// Route: POST /moodboard/getByIds - Get design items by an array of IDs
router.post("/moodboard/getByIds", async (req, res) => {
  try {
    const ids = req.body.ids; // Assuming the IDs are passed in the request body
    const moodboards = await Moodboard.find({ _id: { $in: ids } });

    Debug.LogJson(moodboards);

    res.json(moodboards);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// -----------------------------------------------------------------------------
module.exports = router;
