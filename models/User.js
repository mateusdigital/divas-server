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
const mongoose = require('mongoose');

// -----------------------------------------------------------------------------
const userSchema = new mongoose.Schema({
  //
  fullname: {
    type: String,
    required: true
  },

  //
  username: {
    type: String,
    required: true,
    unique: true
  },

  //
  email: {
    type: String,
    required: true,
    unique: true
  },

  // @XXX: Today this is plain string make it save... 2024-03-25
  password: {
    type: String,
    required: true
  },

  //
  description: String,

  //
  followers: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User'
  }],

  //
  following: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User'
  }],

  //
  likes: {
    type: Number,
    default: 0
  }
});

// -----------------------------------------------------------------------------
const User = mongoose.model('User', userSchema);

// -----------------------------------------------------------------------------
module.exports = User;
