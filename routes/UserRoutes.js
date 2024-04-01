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
const User = require("../models/User");


// -----------------------------------------------------------------------------
// Route: POST /users - Create a new user
router.post("/users", async (req, res) => {
  try {
    const newUser = new User(req.body);
    await newUser.save();
    res.status(201).json(newUser);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
});

// -----------------------------------------------------------------------------
// Route: GET /users - Get all users
router.get("/users", async (req, res) => {
  try {
    const users = await User.find();
    res.json(users);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// -----------------------------------------------------------------------------
// Route: GET /users/:username - Get a single user by username
router.get("/users/:username", getUser, (req, res) => {
  res.json(res.user);
});


// -----------------------------------------------------------------------------
// Route: PATCH /users/:username - Update a user by username
router.patch("/users/:username", getUser, async (req, res) => {
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
    const updatedUser = await res.user.save();
    res.json(updatedUser);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
  });

// -----------------------------------------------------------------------------
// Route: DELETE /users/:username - Delete a user by username
router.delete("/users/:username", getUser, async (req, res) => {
  try {
    await res.user.remove();
    res.json({ message: "User deleted" });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// -----------------------------------------------------------------------------
// Middleware to fetch a user by username
async function getUser(req, res, next) {
  let user;

  try {
    user = await User.findOne({ username: req.params.username });
    if (user == null) {
      return res.status(404).json({ message: "User not found" });
    }
  } catch (err) {
    return res.status(500).json({ message: err.message });
  }

  res.user = user;
  next();
}

// -----------------------------------------------------------------------------
module.exports = router;
