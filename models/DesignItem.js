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
//  File      : DesignItem.js                                                 //
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
const mongoose = require("mongoose");

// -----------------------------------------------------------------------------
const designItemSchema = new mongoose.Schema({
  // DB
  owner: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },

  // Info
  title:       { type: String, required: true },
  description: { type: String, required: true },
  imageUrl:    { type: String, required: true },

  // Stats
  commentsCount: { type: Number, default: 0 },
  likesCount:    { type: Number, default: 0 },

  // Items
  items: { type: mongoose.Schema.Types.ObjectId, ref: "Item", required: true },
});

// -----------------------------------------------------------------------------
const DesignItem = mongoose.model("DesignItem", designItemSchema);

// -----------------------------------------------------------------------------
module.exports = DesignItem;
