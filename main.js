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
//  File      : main.js                                                       //
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
const path     = require("path");
// -----------------------------------------------------------------------------
const express  = require("express");
const mongoose = require("mongoose");
const cors     = require("cors");

require("dotenv").config();

// -----------------------------------------------------------------------------
const userRoutes             = require("./routes/UserRoutes");
const moodboardRoutes        = require("./routes/MoodboardRoutes");
const moodboardItemRoutes    = require("./routes/MoodboardItemRoutes");
const moodboardCommentRoutes = require("./routes/MoodboardCommentRoutes");
const likeRoutes             = require("./routes/MoodboardLikeRoutes");
const uploadRoutes           = require("./routes/UploadRoutes");
const feedRoutes             = require("./routes/FeedRoutes");


// -----------------------------------------------------------------------------
// Express
const app = express();

app.use(express.json({limit: "50mb"}));
app.use(express.urlencoded({limit: "50mb", extended: true}));

// -----------------------------------------------------------------------------
// Middleware
app.use(cors());
app.use(express.json());

// -----------------------------------------------------------------------------
// Database
mongoose.connect(process.env.SERVER_MAIN_URI, {
  useNewUrlParser:    true,
  useUnifiedTopology: true,
});

const db = mongoose.connection;
db.on(
  "error",
  console.error.bind(console, "MongoDB connection error:")
);

db.once("open", () => {
  console.log("Connected to MongoDB");
});


// -----------------------------------------------------------------------------
// Routes
app.use("/", userRoutes);
app.use("/", moodboardRoutes);
app.use("/", moodboardItemRoutes);
app.use("/", moodboardCommentRoutes);
app.use("/", likeRoutes);
app.use("/", uploadRoutes);
app.use("/", feedRoutes);
app.use("/data", express.static(path.join(__dirname, "data")));
app.use("/upload", express.static(path.join(__dirname, "upload")));

// -----------------------------------------------------------------------------
// Start
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server is running on port  http://localhost:${PORT}`);
});
