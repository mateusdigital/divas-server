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
//  File      : process-clothes-data.js                                       //
//  Project   : divas-server                                                  //
//  Date      : 2024-05-02                                                    //
//  License   : See project's COPYING.TXT for full info.                      //
//  Author    : mateus.digital <hello@mateus.digital>                         //
//  Copyright : mateus.digital - 2024                                         //
//                                                                            //
//  Description :                                                             //
//                                                                            //
//----------------------------------------------------------------------------//

//
//   Imports
//

// -----------------------------------------------------------------------------
const fs   = require("fs");
const path = require("path");

//
//  Constants
//

// -----------------------------------------------------------------------------
const NAME_MAPPING = {
  "acessórios"       : "accessories",
  "anéis"            : "rings",
  "artefatos"        : "artifacts",
  "beleza"           : "beauty",
  "blazer e casacos" : "blazers_and_coats",
  "blusascamisas"    : "blousesshirts",
  "bolsas"           : "bags",
  "botas"            : "boots",
  "brincos"          : "toys",
  "broches"          : "brooches",
  "calçados"         : "shoes",
  "calças"           : "pants",
  "camisetas"        : "tshirts",
  "chapéus"          : "hats",
  "cintos"           : "belts",
  "colar"            : "topaste",
  "desenhos"         : "designs",
  "diversos"         : "several",
  "fotos"            : "Photos",
  "Homens"           : "Men",
  "jaquetas"         : "jackets",
  "jeans"            : "jeans",
  "JÓIAS"            : "jewelry",
  "lenços"           : "handkerchief",
  "macacão"          : "monkey",
  "malas"            : "suitcases",
  "óculos"           : "glasses",
  "praia"            : "beach",
  "pulseiras"        : "bracelets",
  "relogios"         : "watches",
  "saias"            : "skirts",
  "shortbermudas"    : "shorts",
  "sueter"          : "sweater",
  "sandalias"        : "sandals",
  "sapatos"          : "shoes",
  "tenis"            : "tennis",
  "textos"           : "texts",
  "vestidos"         : "dresses"
};

const COLOR_MAPPING = {
  "amarelo"          : "yellow",
  "azul"             : "blue",
  "bege"             : "beige",
  "branco"           : "white",
  "cinza"            : "gray",
  "laranja"          : "orange",
  "lilas"            : "lilac",
  "LILAS"            : "lilac",
  "lilás"            : "lilac",
  "rosa"             : "pink",
  "marrom"           : "brown",
  "marron"           : "brown",
  "preto"            : "black",
  "verde"            : "green",
  "vermelho"         : "red",
}

/// "fotoselementos"   : "photoelements",
// @TODO: this isnt part of the clothes

const DATA_DIR_PATH    = "_data/Clube_Divas_Roupas";
const REMOTE_SERVER    = "mateus@mateus.digital";
const REMOTE_BASE_PATH = "/home/mateus/mateus.digital/html/divas/data";

const SYNC_SCRIPT_PATH = "_data/sync.sh";
const DATA_JSON_PATH   = "_data/items.json";

const ALL_CLOTHES_ITEMS = [];


//
// Functions
//

// -----------------------------------------------------------------------------
function map_components(components)
{
  const item_model = {
    category: null,
    subcategory1: null,
    subcategory2: null,
    color: null,
    filename: null,

    target_path: null,
    source_path: null
  };

  const mapped = [];
  for(let component of components) {
    if(component in NAME_MAPPING) {
      const value = NAME_MAPPING[component];

      if(!item_model.category) {
        item_model.category = value;
      } else if(!item_model.subcategory1) {
        item_model.subcategory1 = value;
      } else if(!item_model.subcategory2) {
        item_model.subcategory2 = value;
      }

      mapped.push(value);
    }
    else if(component in COLOR_MAPPING) {
      const value = COLOR_MAPPING[component];

      item_model.color = value;
      mapped.push(value);
    }
    else {
      const ext = path.extname(component);
      if(!ext || ext.length == 0) {
        console.log("-------> ", component);
        console.log("-------> ", component);
        debugger;
      }

      item_model.filename = component;
      mapped.push(component);
    }
  }

  return item_model;
}

// -----------------------------------------------------------------------------
function process_directory(fullpath)
{
  console.log(`Processing dir: ${fullpath}`);
  const files = fs.readdirSync(fullpath);
  for(let i = 0; i < files.length; ++i) {
    console.log(`Processed: ${i} of ${files.length}`);
    const filename = files[i];
    const fullname = `${fullpath}/${filename}`.replace(path.sep, "/");

    const stat = fs.statSync(fullname);
    if(stat.isDirectory()) {
      process_directory(fullname);
      continue;
    } else if(!stat.isFile()) {
      continue;
    }

    const relative_path   = fullname.replace(DATA_DIR_PATH + "/", "");
    const path_components = relative_path.trim("/").split("/");

    const item_info = map_components(path_components);
    item_info.source_path = fullname;

    ALL_CLOTHES_ITEMS.push(item_info);
  }
}

// -----------------------------------------------------------------------------
function is_alpha(character)
{
  return /^[a-zA-Z0-9]+$/.test(character);
}

function path_join(base, ...args)
{
  let p = `${base}`;
  for(let i = 0; i < args.length; ++i) {
    p = `${p}/${args[i]}`;
  }

  return p;
}

// -----------------------------------------------------------------------------
function normalize_filenames(items)
{
  for(let i = 0; i < items.length; ++i) {
    const item = items[i];

    let filename  = item.filename.toLowerCase();
    let extension = path.extname(filename);

    filename = filename.replace(extension, ""); // Remove the extension
    let clean_filename = [];

    for(let j = 0; j < filename.length; ++j) {
      const c = filename[j];
      if(is_alpha(c) || c == "_") {
        clean_filename.push(c);
      } else {
        clean_filename.push("_");
      }
    }

    clean_filename = clean_filename.join("");

    item.filename    = `${clean_filename}${extension.toLowerCase()}`;
    item.target_path = item.category;
    if(item.subcategory1) {
      item.target_path = path_join(item.target_path, item.subcategory1);
    }
    if(item.subcategory2) {
      item.target_path = path_join(item.target_path, item.subcategory2);
    }
    if(item.color) {
      item.target_path = path_join(item.target_path, item.color);
    }
    item.target_path = path_join(item.target_path, item.filename)
  }
}


// -----------------------------------------------------------------------------
function copy_items_local(items)
{
  for(let i = 0; i < items.length; ++i)  {
    console.log(`Copying files locally: ${i} of ${items.length}`);
    const item = items[i];
    const src = item.source_path;
    const dst = item.target_path;

    const dst_dir  = `./data/${path.dirname(dst)}`;
    fs.mkdirSync(dst_dir, { recursive: true});
    fs.copyFileSync(src, `${dst_dir}/${item.filename}`);
  }
}


// -----------------------------------------------------------------------------
function write_items_json_file(items)
{
  const fd   = fs.openSync(DATA_JSON_PATH, "w");
  const json = JSON.stringify(items);

  fs.writeSync(fd, json);
  fs.closeSync(fd);
}


//
// Script
//

// -----------------------------------------------------------------------------
process_directory     (DATA_DIR_PATH);
normalize_filenames   (ALL_CLOTHES_ITEMS)
copy_items_local      (ALL_CLOTHES_ITEMS);
write_sync_script_file(ALL_CLOTHES_ITEMS);
write_items_json_file (ALL_CLOTHES_ITEMS);
