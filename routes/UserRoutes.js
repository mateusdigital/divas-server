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
const express       = require("express");
const router        = express.Router();
const {StatusCodes} = require("http-status-codes");
// -----------------------------------------------------------------------------
const User          = require("../models/User");
const Debug         = require("../helpers/Debug");
// -----------------------------------------------------------------------------
const Endpoints     = require("../divas-shared/shared/API/Endpoints");

// -----------------------------------------------------------------------------
// POST - Create a new user
router.post(Endpoints.User.Create, async (req, res) => {
  try {
    const new_user = new User(req.body);
    await new_user.save();
    return res.status(StatusCodes.CREATED).json(new_user);
  }
  catch (err) {
    return res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({message: err.message});
  }
});

// -----------------------------------------------------------------------------
// GET - Get all users
router.get(Endpoints.User.GetAll, async (req, res) => {
  try {
    const users = await User.find();
    return res.json(users);
  }
  catch (err) {
    debugger;
    return res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({message: err.message});
  }
});

// -----------------------------------------------------------------------------
// GET - Get a single user by username
router.get(Endpoints.User.GetByUsername, _GetUserByUsername, (req, res) => {
  Debug.LogJson(res.user);
  res.json(res.user);
});

// -----------------------------------------------------------------------------
// GET - Get a single user by id
router.get(Endpoints.User.GetById, _GetUserById, (req, res) => {
  Debug.LogJson(res.user);
  res.json(res.user);
});


// -----------------------------------------------------------------------------
// PATCH - Update a user by username
router.patch(Endpoints.User.Update, _GetUserById, async (req, res) => {

  if (req.body.profilePhotoUrl != null) {
    res.user.profilePhotoUrl = req.body.profilePhotoUrl;
  }

  if (req.body.username) {
    res.user.username = req.body.username;
  }
  if (req.body.email) {
    res.user.email = req.body.email;
  }

  if (req.body.fullname) {
    res.user.fullname = req.body.fullname;
  }
  if (req.body.description) {
    res.user.description = req.body.description;
  }

  if (req.body.newPassword) {
    res.user.password = req.body.newPassword;
  }

  try {
    const updated_user = await res.user.save();
    return res.json(updated_user);
  }
  catch (err) {
    debugger;
    return res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({message: err.message});
  }
});

// -----------------------------------------------------------------------------
// DELETE - Delete a user by userId
router.delete(Endpoints.User.Delete, _GetUserById, async (req, res) => {
  try {
    await res.user.remove();
    return res.json({message: "User deleted"});
  }
  catch (err) {
    debugger;
    return res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({message: err.message});
  }
});


// -----------------------------------------------------------------------------
// LOGIN
router.post(Endpoints.User.Login, async (req, res) => {
  try {
    const user = await User.findOne({username: req.body.username});
    if (user == null) {
      res.status(StatusCodes.NOT_FOUND).json({message: "User not found"});
    }
    else if (user.password == req.body.password) {
      Debug.LogJson(user);
      return res.json(user);
    }
    else {
      return res.status(StatusCodes.UNAUTHORIZED).json({message: "Invalid Credentials"});
    }
  }
  catch (err) {
    debugger;
    return res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({message: err.message});
  }
});

// -----------------------------------------------------------------------------
// FOLLOW

router.get(Endpoints.User.GetFollowing, async (req, res) => {
  try {
    const user = await User.findById(req.params.userId);
    if (user == null) {
      return res.status(StatusCodes.NOT_FOUND).json({message: "User not found"});
    }
    const following = await User.find({ _id: { $in: user.following } });
    return res.status(StatusCodes.OK).json(following);
  }
  catch (err) {
    debugger;
    return res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({message: err.message});
  }
});

// -----------------------------------------------------------------------------
router.get(Endpoints.User.GetFollowers, async (req, res) => {
  try {
    const user = await User.findById(req.params.userId);
    if (user == null) {
      return res.status(StatusCodes.NOT_FOUND).json({message: "User not found"});
    }
    const followers = await User.find({ _id: { $in: user.followers} });
    return res.status(StatusCodes.OK).json(followers);
  }
  catch (err) {
    debugger;
    return res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({message: err.message});
  }
});

// -----------------------------------------------------------------------------
router.post(Endpoints.User.ToggleFollow, async (req, res) => {
  try {
    const user = await User.findById(req.body.userId);
    if (user == null) {
      return res.status(StatusCodes.NOT_FOUND).json({message: "User not found"});
    }

    const target = await User.findById(req.body.targetId);
    if (target == null) {
      return res.status(StatusCodes.NOT_FOUND).json({message: "Target not found"});
      return;
    }

    const result = { isFollowing: false };
    if (!user.following.includes(target._id)) {
      user.following.push(target._id);
      target.followers.push(user._id);
      result.isFollowing = true;
      }
      else {
        user.following.pull(target._id);
        target.followers.pull(user._id);
        result.isFollowing = false;
    }


    // Save both user documents
    await user.save();
    await target.save();

    return res.status(StatusCodes.OK).json(result);
  }
  catch (err) {
    debugger;
    return res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({message: err.message});
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
    user = await User.findOne({username: req.params.username});
    if (user == null) {
      return res.status(StatusCodes.NOT_FOUND).json({message: "User not found"});
    }
  }
  catch (err) {
    debugger;
    return res.status(Status.INTERNAL_SERVER_ERROR).json({message: err.message});
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
      return res.status(StatusCodes.NOT_FOUND).json({message: "User not found"});
    }
  }
  catch (err) {
    debugger;
    return res.status(Status.INTERNAL_SERVER_ERROR).json({message: err.message});
  }

  res.user = user;
  next();
}


// -----------------------------------------------------------------------------
module.exports = router;
