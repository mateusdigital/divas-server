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
//  File      : MoodboardRoutes.js                                            //
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
const express       = require("express");
const router        = express.Router();
const {StatusCodes} = require("http-status-codes");
// -----------------------------------------------------------------------------
const Debug         = require("../helpers/Debug");
// -----------------------------------------------------------------------------
const Moodboard     = require("../models/Moodboard");
const User          = require("../models/User");
// -----------------------------------------------------------------------------
const Endpoints     = require("../divas-shared/shared/API/Endpoints");

// -----------------------------------------------------------------------------
// POST - Create a new Moodboard
router.post(Endpoints.Moodboard.Create, async (req, res) => {
  try {
    const {info, items, photoUrl, user} = req.body;

    const moodboard_items = [];
    for (var item of items) {
      moodboard_items.push(item.model);
    }

    if(!info || info.title.length == 0) {
      res
        .status(StatusCodes.BAD_REQUEST)
        .json({message: "Title can't be empty"})
    }
    if(!info || info.description.length == 0) {
      res
        .status(StatusCodes.BAD_REQUEST)
        .json({message: "Description can't be empty"})
    }


    const moodboard = await Moodboard.create({
      owner:          user._id,
      title:          info.title,
      description:    info.description,
      photoUrl:       photoUrl,
      moodboardItems: moodboard_items,
    });

    await User.findByIdAndUpdate(
      moodboard.owner,
      {$push: {moodboards: moodboard._id}},
      {new: true}
    );

    res
      .status(StatusCodes.CREATED)
      .json(moodboard);
  }
  catch (error) {
    res
      .status(StatusCodes.INTERNAL_SERVER_ERROR)
      .json({message: error.message});
  }
});

// -----------------------------------------------------------------------------
// POST - Create a new Moodboard
router.post(Endpoints.Moodboard.SaveDraft, async (req, res) => {
  try {
    const {info, items, user} = req.body;

    const moodboard_items = [];
    for (let item of items) {
      moodboard_items.push(item.model);
    }

    let moodboard = null;
    if(info._id) {
      moodboard = await Moodboard.findByIdAndUpdate(
        info._id,
        {
          owner: user._id,
          title: info.title,
          description: info.description,
          moodboardItems: moodboard_items,
          isDraft: true
        },
        { new: true, runValidators: true }
      );
    }
    else {
      moodboard = await Moodboard.create({
        owner:          user._id,
        title:          info.title,
        description:    info.description,
        moodboardItems: moodboard_items,
        isDraft:        true
      });
    }

    await User.findByIdAndUpdate(
      moodboard.owner,
      {$push: {moodboards: moodboard._id}},
      {new: true}
    );

    res
      .status(StatusCodes.CREATED)
      .json(moodboard);
  }
  catch (error) {
    res
      .status(StatusCodes.INTERNAL_SERVER_ERROR)
      .json({message: error.message});
  }
});

// -----------------------------------------------------------------------------
// GET - Get all moodboards
router.get(Endpoints.Moodboard.GetAll, async (req, res) => {
  try {

    const owner = req.params.id;
    const moodboards = await Moodboard.find({ owner });

    Debug.LogJson(moodboards);

    res.json(moodboards);
  }
  catch (error) {
    debugger;
    res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({message: error.message});
  }
});

// -----------------------------------------------------------------------------
// GET - Get a specific moodboard by ID
router.get(Endpoints.Moodboard.GetById, async (req, res) => {
  try {
    const moodboard = await Moodboard.findById(req.params.id);
    if (!moodboard) {
      res
        .status(StatusCodes.NOT_FOUND)
        .json({message: "Moodboard not found"});

      return;
    }

    Debug.LogJson(moodboard);
    res.json(moodboard);
  }
  catch (error) {
    debugger;
    res
      .status(StatusCodes.INTERNAL_SERVER_ERROR)
      .json({message: error.message});
  }
});

// -----------------------------------------------------------------------------
// POST - Get multiple moodboard by an array of IDs
router.post(Endpoints.Moodboard.GetMultiple, async (req, res) => {
  try {
    const ids        = req.body.ids;
    const moodboards = await Moodboard.find({_id: {$in: ids}});

    Debug.LogJson(moodboards);

    res.json(moodboards);
  }
  catch (error) {
    debugger;
    res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({message: error.message});
  }
});

// -----------------------------------------------------------------------------
module.exports = router;
