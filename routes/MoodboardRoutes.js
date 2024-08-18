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
const MoodboardLike = require("../models/MoodboardLike");
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
      return res
        .status(StatusCodes.BAD_REQUEST)
        .json({message: "Title can't be empty"})
    }
    if(!info || info.description.length == 0) {
      return res
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

    return res
      .status(StatusCodes.CREATED)
      .json(moodboard);
  }
  catch (error) {
    return res
      .status(StatusCodes.INTERNAL_SERVER_ERROR)
      .json({message: error.message});
  }
});

// -----------------------------------------------------------------------------
// POST - Save moodboard as draft
router.post(Endpoints.Moodboard.SaveDraft, async (req, res) => {
  try {
    const {info, items, user, fabric, photoUrl} = req.body;

    const moodboard_object = {
      owner: user._id,
      title: info.title,
      description: info.description,
      photoUrl: photoUrl,
      moodboardItems: items,
      fabricItems: fabric,
      isDraft: true
    };

    let moodboard = null;
    if(info._id) {
      moodboard = await Moodboard.findByIdAndUpdate(
        info._id,
        moodboard_object,
        { new: true, runValidators: true }
      );
    }
    else {
      moodboard = await Moodboard.create(moodboard_object);
    }

    await User.findByIdAndUpdate(
      moodboard.owner,
      {$push: {moodboards: moodboard._id}},
      {new: true}
    );

    return res
      .status(StatusCodes.CREATED)
      .json(moodboard);
  }
  catch (error) {
    return res
      .status(StatusCodes.INTERNAL_SERVER_ERROR)
      .json({message: error.message});
  }
});

// -----------------------------------------------------------------------------
router.delete(Endpoints.Moodboard.DeleteById, async (req, res) => {

  try {
    const moodboardId = req.params.moodboardId;
    if(!moodboardId) {
      return res.status(StatusCodes.BAD_REQUEST).json({message: "Missing moodboardId"});
    }

    const result = await Moodboard.deleteOne({ _id: moodboardId });
    return res.status(StatusCodes.OK).json(result);
  }
  catch (error) {
    debugger;
    return res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({message: error.message});
  }
});


// -----------------------------------------------------------------------------
// GET - Get all moodboards from a User
router.get(Endpoints.Moodboard.GetAllFromUser, async (req, res) => {
  try {
    const owner = req.params.id;

    const moodboards          = await Moodboard.find({ owner });
    const filtered_moodboards = moodboards.filter((moodboard) => {
      return !moodboard.isDraft;
    })

    Debug.LogJson(filtered_moodboards);

    return res.json(filtered_moodboards);
  }
  catch (error) {
    debugger;
    return res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({message: error.message});
  }
});

// -----------------------------------------------------------------------------
// GET - Get all moodboard that were liked by this user.
router.get(Endpoints.Moodboard.GetLikedByUser, async (req, res) => {
  try {
    const userId = req.params.userId;

    const owner = await User.findById(userId);
    if(!owner) {
      return res.status(StatusCodes.BAD_REQUEST, `Invalid user with ${userId}`);
      return;
    }


    const moodboards = await MoodboardLike.find({owner})
    Debug.LogJson(moodboards);

    return res.json(moodboards);
  }
  catch (error) {
    debugger;
    return res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({message: error.message});
  }
});

// -----------------------------------------------------------------------------
// GET - Get all the moodboards that are saved as draft by the user.
router.get(Endpoints.Moodboard.GetUserDrafts, async (req, res) => {
  try {
    const userId = req.params.userId;

    const owner = await User.findById(userId).populate("moodboards");
    if(!owner) {
      return res.status(StatusCodes.BAD_REQUEST, `Invalid user with ${userId}`);
      return;
    }


    const moodboards = owner.moodboards;
    const filtered_moodboards = moodboards.filter((moodboard) =>{
      return moodboard.isDraft;
    });

    Debug.LogJson(filtered_moodboards);
    return res.json(filtered_moodboards);
  }
  catch (error) {
    debugger;
    return res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({message: error.message});
  }
});

// -----------------------------------------------------------------------------
// GET - Get a specific moodboard by ID
router.get(Endpoints.Moodboard.GetById, async (req, res) => {
  try {
    const moodboard = await Moodboard.findById(req.params.id);
    if (!moodboard) {
      return res
        .status(StatusCodes.NOT_FOUND)
        .json({message: "Moodboard not found"});

      return;
    }

    Debug.LogJson(moodboard);
    return res.json(moodboard);
  }
  catch (error) {
    debugger;
    return res
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

    return res.json(moodboards);
  }
  catch (error) {
    debugger;
    return res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({message: error.message});
  }
});

// -----------------------------------------------------------------------------
// GET - Get Moodboard Edit Data
router.get(Endpoints.Moodboard.GetEditData, async (req, res) => {
  try {
    const moodboard = await Moodboard
      .findById(req.params.moodboardId)
      .populate('moodboardItems')
      .exec();

    if (!moodboard) {
      return res
        .status(StatusCodes.NOT_FOUND)
        .json({message: "Moodboard not found"});

      return;
    }

    Debug.LogJson(moodboard);
    return res.json(moodboard);
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
