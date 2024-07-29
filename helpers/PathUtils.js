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
//  File      : PathUtils.js                                                  //
//  Project   : divas-server                                                  //
//  Date      : 2024-05-13                                                    //
//  License   : See project's COPYING.TXT for full info.                      //
//  Author    : mateus.digital <hello@mateus.digital>                         //
//  Copyright : mateus.digital - 2024                                         //
//                                                                            //
//  Description :                                                             //
//                                                                            //
//----------------------------------------------------------------------------//


// -----------------------------------------------------------------------------
class PathUtils
{
  /** Same as the path.join but always with Unix path separators */
  static Join(base, ...args)
  {
    let p = `${base}`;
    for(let i = 0; i < args.length; ++i) {
      p = `${p}/${args[i]}`;
    }

    return p;
  }

  // ---------------------------------------------------------------------------
  // @XXX: Improve the thing....
  static CreateUniqueFilename(extension)
  {
    const filename = Date.now() + ((extension) ? extension : "");
    return filename;
  }

}

module.exports = PathUtils;