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
//  File      : DesignItemRoutes.js                                           //
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
const DesignItem = require("../models/DesignItem");
const User       = require("../models/User");


// -----------------------------------------------------------------------------
// Route: POST /designItem - Create a new DesignItem
router.post("/designItem/", async (req, res) => {
  try {
    const designItem = await DesignItem.create(req.body);

    // Update the corresponding user document to include the new design item.
    await User.findByIdAndUpdate(
      designItem.owner,
      { $push: { designItems: designItem._id } },
      { new: true }
    );

    res.status(201).json(designItem);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// -----------------------------------------------------------------------------
// Route: GET /designItem - Get all design items
router.get("/designItem/", async (req, res) => {
  try {
    const design_items = await DesignItem.find();

    Debug.LogJson(design_items);

    res.json(design_items);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// -----------------------------------------------------------------------------
// Route: GET /designItem:id - Get a specific design item by ID
router.get("/designItem/:id", async (req, res) => {
  try {
    const design_item = await DesignItem.findById(req.params.id);
    if (!design_item) {
      return res.status(404).json({ message: "Design item not found" });
    }

    Debug.LogJson(design_item);

    res.json(design_item);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// -----------------------------------------------------------------------------
// Route: POST /designItem/getByIds - Get design items by an array of IDs
router.post("/designItem/getByIds", async (req, res) => {
  try {
    const ids = req.body.ids; // Assuming the IDs are passed in the request body
    const design_items = await DesignItem.find({ _id: { $in: ids } });

    Debug.LogJson(design_items);

    res.json(design_items);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// -----------------------------------------------------------------------------
module.exports = router;
