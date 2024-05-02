//~---------------------------------------------------------------------------//
//                               *       +                                    //
//                         "                  |                               //
//                     ()    .-.,="``"=.    - o -                             //
//                           "=/_       \     |                               //
//                        *   |  "=._    |                                    //
//                             \     `=./`,        "                          //
//                          .   "=.__.=" `="      *                           //
//                 +                         +                                //
//                      O      *        "       .                             //
//                                                                            //
//  File      : UserRoutes.js                                                 //
//  Project   : divas-server                                                  //
//  Date      : 2024-03-25                                                    //
//  License   : See project"s COPYING.TXT for full info.                      //
//  Author    : mateus.digital <hello@mateus.digital>                         //
//  Copyright : mateus.digital - 2024                                         //
//                                                                            //
//  Description :                                                             //
//                                                                            //
//---------------------------------------------------------------------------~//


// -----------------------------------------------------------------------------
const express = require("express");
const router = express.Router();
const { StatusCodes } = require("http-status-codes");
//
const User  = require("../models/User");
const Debug = require("../helpers/Debug");
//
const Endpoints = require("../divas-shared/shared/API/Endpoints");

// -----------------------------------------------------------------------------
// POST - Create a new user
router.post(Endpoints.User.Create, async (req, res)=>{
  try {
    const new_user = new User(req.body);
    await new_user.save();
    res.status(StatusCodes.CREATED).json(new_user);
  } catch (err) {
    debugger;
    res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({ message: err.message });
  }
});

// -----------------------------------------------------------------------------
// GET - Get all users
router.get(Endpoints.User.GetAll, async (req, res)=>{
  try {
    const users = await User.find();
    res.json(users);
  } catch (err) {
    debugger;
    res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({ message: err.message });
  }
});

// -----------------------------------------------------------------------------
// GET - Get a single user by username
router.get(Endpoints.User.GetByUsername, _GetUserByUsername, (req, res)=>{
  Debug.LogJson(res.user);
  res.json(res.user);
});

// -----------------------------------------------------------------------------
// GET - Get a single user by id
router.get(Endpoints.User.GetById, _GetUserById, (req, res)=>{
  Debug.LogJson(res.user);
  res.json(res.user);
});


// -----------------------------------------------------------------------------
// PATCH - /users/:userId - Update a user by username
router.patch(Endpoints.User.Update, _GetUserById, async (req, res)=>{

  if (req.body.profilePhotoUrl != null) {
    res.user.profilePhotoUrl = req.body.profilePhotoUrl;
  }
  if (req.body.fullname != null) {
    res.user.fullname = req.body.fullname;
  }
  if (req.body.username != null) {
    res.user.username = req.body.username;
  }
  if (req.body.description != null) {
    res.user.description = req.body.description;
  }
  if (req.body.password != null) {
    res.user.password = req.body.password;
  }

  try {
    const updated_user = await res.user.save();
    res.json(updatedUser);
  } catch (err) {
    debugger;
    res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({ message: err.message });
  }
});

// -----------------------------------------------------------------------------
// DELETE - /users/:userId - Delete a user by userId
router.delete(Endpoints.User.Delete, _GetUserById, async (req, res) => {
  try {
    await res.user.remove();
    res.json({ message: "User deleted" });
  } catch (err) {
    debugger;
    res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({ message: err.message });
  }
});


//
// Middleware
//

// -----------------------------------------------------------------------------
async function _GetUserByUsername(req, res, next)
{
  let user;

  try {
    user = await User.findOne({ username: req.params.username });
    if (user == null) {
      return res.status(StatusCodes.NOT_FOUND).json({ message: "User not found" });
    }
  } catch (err) {
    debugger;
    return res.status(Status.INTERNAL_SERVER_ERROR).json({ message: err.message });
  }

  res.user = user;
  next();
}

// -----------------------------------------------------------------------------
async function _GetUserById(req, res, next)
{
  let user;

  try {
    user = await User.findById(req.params.userId);
    if (user == null) {
      return res.status(StatusCodes.NOT_FOUND).json({ message: "User not found" });
    }
  } catch (err) {
    debugger;
    return res.status(Status.INTERNAL_SERVER_ERROR).json({ message: err.message });
  }

  res.user = user;
  next();
}


// -----------------------------------------------------------------------------
module.exports = router;
