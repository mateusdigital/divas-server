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
const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");

require("dotenv").config();

// -----------------------------------------------------------------------------
const userRoutes = require("./routes/UserRoutes");



// -----------------------------------------------------------------------------
// Express
const app = express();

// -----------------------------------------------------------------------------
// Middleware
app.use(cors());
app.use(express.json()); // Parse JSON request bodies

// -----------------------------------------------------------------------------
// Database
mongoose.connect(process.env.MONGODB_URI, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});


const db = mongoose.connection;
db.on("error",
  console.error.bind(console, "MongoDB connection error:")
);

db.once("open", () => {
  console.log("Connected to MongoDB");
});


// -----------------------------------------------------------------------------
// Routes
app.use('/', userRoutes);


// -----------------------------------------------------------------------------
// Start
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server is running on port  http://localhost:${PORT}`);
});
