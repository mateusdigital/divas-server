// -----------------------------------------------------------------------------
const express       = require("express");
const router        = express.Router();
const {StatusCodes} = require("http-status-codes");
// -----------------------------------------------------------------------------
const Debug         = require("../helpers/Debug");
// -----------------------------------------------------------------------------
const Moodboard     = require("../models/Moodboard");
// -----------------------------------------------------------------------------
const Endpoints     = require("../divas-shared/shared/API/Endpoints");


// -----------------------------------------------------------------------------
// GET - Get the feed for a user
router.get(Endpoints.Feed.UserFeed, async (req, res) => {
  try {
    const owner = req.params.userId;

    // Parse pagination parameters from query string
    const page = parseInt(req.query.page, 10) || 1;
    const limit = parseInt(req.query.limit, 10) || 10;

    // Validate pagination parameters
    if (page < 1 || limit < 1) {
      return res.status(StatusCodes.BAD_REQUEST).json({ message: 'Invalid pagination parameters' });
    }

    // Calculate the number of items to skip based on the page and limit
    const skip = (page - 1) * limit;

    // Fetch and sort moodboards by creation date, then paginate
    const moodboards = await Moodboard.find({ owner})
      .sort({ createdAt: -1 }) // Sort by creation date in descending order
      .skip(skip)
      .limit(limit)
      .populate("owner")
      .exec();

    // Fetch the total count of moodboards to calculate the total pages
    const totalMoodboards = await Moodboard.countDocuments({ owner });

    // Prepare response data
    const response = {
      moodboards,
      totalPages: Math.ceil(totalMoodboards / limit),
      currentPage: page,
      totalItems: totalMoodboards,
    };

    return res.json(response);
  } catch (error) {
    console.error(error.message); // Log the error message
    return res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({ message: error.message });
  }
});

// -----------------------------------------------------------------------------
module.exports = router;
