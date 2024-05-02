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
const router  = express.Router();
const { StatusCodes } = require("http-status-codes");
// -----------------------------------------------------------------------------
const Debug = require("../helpers/Debug");
// -----------------------------------------------------------------------------
const Moodboard = require("../models/Moodboard");
const User      = require("../models/User");


// -----------------------------------------------------------------------------
// Route: POST - /moodboard - Create a new Moodboard
router.post("/moodboard/", async (req, res)=>{
  try {
    const moodboard = await Moodboard.create(req.body);

    await User.findByIdAndUpdate(
      moodboard.owner,
      { $push: { moodboards: moodboard._id } },
      { new: true }
    );

    res.status(StatusCodes.CREATED).json(moodboard);

  } catch (error) {
    res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({ message: error.message });
  }
});

// -----------------------------------------------------------------------------
// Route: GET - /moodboard - Get all design items
router.get("/moodboard/", async (req, res) => {
  try {
    const moodboards = await Moodboard.find();

    Debug.LogJson(moodboards);

    res.json(moodboards);
  } catch (error) {
    debugger;
    res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({ message: error.message });
  }
});

// -----------------------------------------------------------------------------
// Route: GET - /moodboard/:id - Get a specific moodboard by ID
router.get("/moodboard/:id", async (req, res)=>{
  try {
    const moodboard = await Moodboard.findById(req.params.id);
    if (!moodboard) {
      return res.status(StatusCodes.NOT_FOUND).json({ message: "Moodboard not found" });
    }

    Debug.LogJson(moodboard);
    res.json(moodboard);
  } catch (error) {
    debugger;
    res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({ message: error.message });
  }
});

// -----------------------------------------------------------------------------
// Route: Post /moodboard/ids/ - Get multiple moodboard by an array of IDs
router.post("/moodboard/ids/", async (req, res) => {
  try {
    const ids = req.body.ids;
    const moodboards = await Moodboard.find({ _id: { $in: ids } });

    Debug.LogJson(moodboards);

    res.json(moodboards);
  } catch (error) {
    debugger;
    res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({ message: error.message });
  }
});

// -----------------------------------------------------------------------------
module.exports = router;
