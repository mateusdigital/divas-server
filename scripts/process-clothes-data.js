
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
  "fotoselementos"   : "photoelements",
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
    item: null,

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

      item_model.item = component;
      mapped.push(component);
    }
  }

  item_model.target_path = mapped.join("/");
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
function write_sync_script_file(items)
{
  const fd = fs.openSync(SYNC_SCRIPT_PATH, "w")
  for(let i = 0; i < items.length; ++i) {
    console.log(`Writing sync string: ${i} of ${items.length}`);
    const item = items[i];

    const log_str  = `echo Syncing: ${i} of ${items.length} - ${item.target_path}\n`;
    const sync_str = `rsync -pr --verbose --mkpath "${item.source_path}" ${REMOTE_SERVER}:${REMOTE_BASE_PATH}/${item.target_path}\n`;

    fs.writeSync(fd, log_str);
    fs.writeSync(fd, sync_str);
  }

  fs.closeSync(fd);
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
process_directory(DATA_DIR_PATH);

write_sync_script_file(ALL_CLOTHES_ITEMS);
write_items_json_file (ALL_CLOTHES_ITEMS);
