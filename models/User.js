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
//  File      : User.js                                                       //
//  Project   : divas-server                                                  //
//  Date      : 2024-03-25                                                    //
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
const UserSchema = new mongoose.Schema({
  // Info
  fullname:        { type: String, required: true }, // The fullname of this user.
  description:     { type: String },                 // The description of this user.

  // Photos
  profilePhotoUrl: { type: String }, // The photo of this user.

  // Login
  username: { type: String, required: true, unique: true }, // Username of this user.
  email:    { type: String, required: true, unique: true }, // Email of this user.
  password: { type: String, required: true },               // @XXX: Today this is plain string make it save... 2024-03-25

  // Social
  followers:  [{ type: mongoose.Schema.Types.ObjectId, ref: "User" }], // Other users that follow this user.
  following:  [{ type: mongoose.Schema.Types.ObjectId, ref: "User" }], // Users that this user is following.
  likesCount: {  type: Number, default: 0 },                           // How much likes this user has.

  // Moodboards
  moodboards: [{ type: mongoose.Schema.Types.ObjectId, ref: "Moodboard" }], // List of moodboard of this user.
  collectionsCount: { type: Number, default: 0 },                           // How much collections this user has.
});

// -----------------------------------------------------------------------------
const User = mongoose.model("User", UserSchema);

// -----------------------------------------------------------------------------
module.exports = User;
