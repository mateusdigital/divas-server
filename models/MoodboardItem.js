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
//  File      : MoodboardItem.js                                              //
//  Project   : divas-server                                                  //
//  Date      : 2024-04-16                                                    //
//  License   : See project's COPYING.TXT for full info.                      //
//  Author    : mateus.digital <hello@mateus.digital>                         //
//  Copyright : mateus.digital - 2024                                         //
//                                                                            //
//  Description :                                                             //
//                                                                            //
//----------------------------------------------------------------------------//

// -----------------------------------------------------------------------------
const mongoose = require("mongoose");

// -----------------------------------------------------------------------------
const MoodboardItemSchema = new mongoose.Schema({
  //
  imageUrl: { type: String, required: true, unique: true},

  // Info
  category:     { type: String, required: true },
  subcategory1: { type: String },
  subcategory2: { type: String },
  color:        { type: String },

  commentsCount: { type: Number },
});

// -----------------------------------------------------------------------------
const MoodboardItem = mongoose.model("MoodboardItem", MoodboardItemSchema);

// -----------------------------------------------------------------------------
module.exports = MoodboardItem;
