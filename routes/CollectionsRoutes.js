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
//  File      : CollectionsRoutes.js                                          //
//  Project   : divas-server                                                  //
//  Date      : 2024-04-24                                                    //
//  License   : See project's COPYING.TXT for full info.                      //
//  Author    : mateus.digital <hello@mateus.digital>                         //
//  Copyright : mateus.digital - 2024                                         //
//                                                                            //
//  Description :                                                             //
//                                                                            //
//----------------------------------------------------------------------------//

// -----------------------------------------------------------------------------
const express = require("express");
const router = express.Router();
// -----------------------------------------------------------------------------
const Debug = require("../helpers/Debug");
// -----------------------------------------------------------------------------
const User       = require("../models/User");
const Moodboard  = require("../models/Moodboard");
const Collection = require("../models/Collection");

// -----------------------------------------------------------------------------
// Route: POST /collection - Create a new Collection
router.post("/collection", async (req, res)=>{
  try {
    const collection = await Collection.create(req.body);
    await collection.save();

    Debug.LogJson(collection);

    res.status(201).json(collection);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// -----------------------------------------------------------------------------
// Route: GET /collection - Get all collection items
router.get("/collection", async (req, res) => {
  try {
    const collection_items = await Collection.find();

    Debug.LogJson(collection_items);

    res.json(collection_items);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// -----------------------------------------------------------------------------
// Route: GET /collection/:userId - Get all collections from a user with id
router.get("/collection/:userId", async (req, res) => {
  try {
    const collections = await Collection.find({ owner: req.params.userId });

    if (!collections) {
      return res.status(404).json({ message: "User not found" });
    }

    const moodboard_ids = collections.map((collection)=>{ return collection.targetMoodboard; });
    const moodboards    = await Moodboard.find({ _id: { $in: moodboard_ids } });

    Debug.LogJson(collections);
    Debug.LogJson(moodboards);

    res.json(moodboards);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});


// -----------------------------------------------------------------------------
module.exports = router;
