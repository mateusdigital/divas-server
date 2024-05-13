//----------------------------------------------------------------------------//
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
//  File      : FSUtils.js                                                    //
//  Project   : divas-server                                                  //
//  Date      : 2024-05-13                                                    //
//  License   : See project's COPYING.TXT for full info.                      //
//  Author    : mateus.digital <hello@mateus.digital>                         //
//  Copyright : mateus.digital - 2024                                         //
//                                                                            //
//  Description :                                                             //
//                                                                            //
//----------------------------------------------------------------------------//

const fs = require("fs");

// -----------------------------------------------------------------------------
class FSUtils
{

  static IsDir(path)
  {
    try {
      const stat = fs.statSync(path);
      return stat.isDirectory();
    } catch(error) {
      return false;
    }
  }

  static EnsureDirectory(path)
  {
    if(FSUtils.IsDir(path)) {
      return;
    }

    fs.mkdirSync(path, {recursive: true});
  }
}

// -----------------------------------------------------------------------------
module.exports = FSUtils;