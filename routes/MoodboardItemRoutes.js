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
const Endpoints = require("../divas-shared/shared/API/Endpoints");


// -----------------------------------------------------------------------------
// POST - Create a new Moodboard Item
router.post(Endpoints.MoodboardItem.Create, async (req, res)=>{
  try {
    const moodboard_item = await MoodboardItem.create(req.body);
    return res.status(StatusCodes.CREATED).json(moodboard_item);
  } catch (error) {
    debugger;
    return res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({ message: error.message });
  }
});


//
// GET
//

// -----------------------------------------------------------------------------
// GET - Get all Moodboard Items
router.get(Endpoints.MoodboardItem.GetAll, async (req, res) => {
  try {
    const moodboard_items = await MoodboardItem.find();

    Debug.LogJson(moodboard_items);

    return res.json(moodboard_items);
  } catch (error) {
    debugger;
    return res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({ message: error.message });
  }
});

// -----------------------------------------------------------------------------
// GET - Get a specific Moodboard Item by ID
router.get(Endpoints.MoodboardItem.GetById, async (req, res)=>{
  try {
    const moodboard_item = await MoodboardItem.findById(req.params.id);
    if (!moodboard_item) {
      return res.status(StatusCodes.NOT_FOUND).json({ message: "Moodboard Item not found" });
    }

    Debug.LogJson(moodboard_item);
    return res.json(moodboard_item);
  } catch (error) {
    debugger;
    return res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({ message: error.message });
  }
});


// -----------------------------------------------------------------------------
// GET - Get a specific Moodboard Item by Category
router.get(Endpoints.MoodboardItem.GetByCategory, async (req, res)=>{
  try {
    const query_category     = req.params.category;
    const query_subcategory1 = req.params.subcategory1;
    const query_subcategory2 = req.params.subcategory2;

    const db_query = { category: query_category };
    if(query_subcategory1) {
      db_query.subcategory1 = query_subcategory1;
    }
    if(query_subcategory2) {
      db_query.subcategory2 = query_subcategory2;
    }

    const moodboard_item = await MoodboardItem.find(db_query);
    if (!moodboard_item) {
      return res.status(StatusCodes.NOT_FOUND).json({ message: "Moodboard Item not found" });
    }

    Debug.LogJson(moodboard_item);
    return res.status(StatusCodes.OK).json(moodboard_item);
  } catch (error) {
    debugger;
    return res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({ message: error.message });
  }
});

// -----------------------------------------------------------------------------
// POST - Get multiple moodboard by an array of IDs
router.post(Endpoints.MoodboardItem.GetMultiple, async (req, res) => {
  try {
    const ids = req.body.ids;
    const moodboard_items = await MoodboardItem.find({ _id: { $in: ids } });

    Debug.LogJson(moodboard_items);

    return res.json(moodboard_items);
  } catch (error) {
    debugger;
    return res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({ message: error.message });
  }
});



// -----------------------------------------------------------------------------
module.exports = router;
