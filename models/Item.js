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
//  File      : Item.js                                                       //
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
const ItemSchema = new mongoose.Schema({
  imageUrl: { type: String, required: true },
  // Info
  category:  { type: String, required: true },
  color:     { type: String, required: true },
});

// -----------------------------------------------------------------------------
const Item = mongoose.model("Item", ItemSchema);

// -----------------------------------------------------------------------------
module.exports = Item;
