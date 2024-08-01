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
const moodboardSchema = new mongoose.Schema({
  // DB
  owner: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },

  // Info
  title:       { type: String  },
  description: { type: String  },
  photoUrl:    { type: String  },
  isDraft:     { type: Boolean },

  // Stats
  commentsCount: { type: Number, default: 0 },
  likesCount:    { type: Number, default: 0 },

  // Items
  moodboardItems: [{ type: mongoose.Schema.Types.ObjectId, ref: "MoodboardItem", }],
  // required: true },
});

// -----------------------------------------------------------------------------
const Moodboard = mongoose.model("Moodboard", moodboardSchema);

// -----------------------------------------------------------------------------
module.exports = Moodboard;
