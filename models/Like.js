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
//  File      : Like.js                                                       //
//  Project   : divas-server                                                  //
//  Date      : 2024-04-01                                                    //
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
const LikeSchema = new mongoose.Schema({
  // DB
  owner: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
  // Info
  targetUser:       { type: mongoose.Schema.Types.ObjectId, ref: "User",       required: true },
  targetDesignItem: { type: mongoose.Schema.Types.ObjectId, ref: "DesignItem", required: true },
});

// -----------------------------------------------------------------------------
const Like = mongoose.model("Like", LikeSchema);

// -----------------------------------------------------------------------------
module.exports = Like;
