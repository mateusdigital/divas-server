// -----------------------------------------------------------------------------
const express = require("express");
const router = express.Router();
const formidable = require("formidable");
const StatusCodes = require("http-status-codes");
// -----------------------------------------------------------------------------
const Endpoints = require("../divas-shared/shared/API/Endpoints");

// -----------------------------------------------------------------------------

// -----------------------------------------------------------------------------
// POST - Create a new user
router.post(Endpoints.User.UploadProfilePhoto, async (req, res)=>{
  const form = new formidable.IncomingForm();
  form.parse(req, async (err, fields, files) => {
    if (err) {
      return res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({ error: "Failed to process form data" });
    }

    const file = files.file;


    res.status(StatusCodes.CREATED).json({ success: true });
  });
});


// -----------------------------------------------------------------------------
module.exports = router;