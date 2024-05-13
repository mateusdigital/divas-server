// -----------------------------------------------------------------------------
const express = require("express");
const router = express.Router();
const formidable = require("formidable");
const StatusCodes = require("http-status-codes");
const fs = require("fs");
const path = require("path");
// -----------------------------------------------------------------------------
const PathUtils = require("../helpers/PathUtils");
const FSUtils = require("../helpers/FSUtils");
const Endpoints = require("../divas-shared/shared/API/Endpoints");


// -----------------------------------------------------------------------------
const _USERS_UPLOAD_PATH = PathUtils.Join("upload", "users");

// -----------------------------------------------------------------------------
/// @XXX: Find a place to save the photo.
function _GetUploadDir()
{
  const upload_path = PathUtils.Join(process.cwd());
  return upload_path;
}


// -----------------------------------------------------------------------------
// POST - Upload new ProfilePhoto
router.post(Endpoints.User.UploadProfilePhoto, async (req, res)=>{
  const form = new formidable.IncomingForm();
  form.parse(req, async (err, fields, files) => {
    if (err) {
      return res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({ error: "Failed to process form data" });
    }

    // Get the Upload dir.
    const base_upload_dir = _GetUploadDir();
    const upload_dir      = PathUtils.Join(base_upload_dir, _USERS_UPLOAD_PATH);

    FSUtils.EnsureDirectory(upload_dir);

    // Copy the file
    const temp_path       = files.profilePhoto[0].filepath;
    const temp_extension  = path.extname(files.profilePhoto[0].originalFilename) ;

    const unique_filename = PathUtils.CreateUniqueFilename(temp_extension);
    const save_path       = PathUtils.Join(upload_dir, unique_filename);
    const return_path     = PathUtils.Join(_USERS_UPLOAD_PATH, unique_filename);

    fs.renameSync(temp_path, save_path);

    res.status(StatusCodes.CREATED).json({
      success: true,
      profilePhotoPath: return_path
    });
  });
});


// -----------------------------------------------------------------------------
module.exports = router;