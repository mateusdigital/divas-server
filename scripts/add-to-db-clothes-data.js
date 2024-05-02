
// -----------------------------------------------------------------------------
const fs = require("fs");
require("dotenv").config();


class FSUtils
{
  static ReadAllFileSync(path, bufferSizeHint = 1024)
  {
    const fd = fs.openSync(path);
    const buffer = Buffer.alloc(bufferSizeHint);

    let data = "";
    let bytes_read = 0;
    do {
      bytes_read = fs.readSync(fd, buffer, 0, bufferSizeHint, null);
      data += buffer.toString("utf-8", 0, bytes_read);
    } while(bytes_read == bufferSizeHint);

    fs.closeSync(fd);
    return data;
  }
}

// -----------------------------------------------------------------------------
async function add_item(index, api_url) {
  if (index >= ITEMS_DATA.length) {
    console.log("All done...");
    return;
  }

  const item_data = ITEMS_DATA[index];

  const item_model = {
    imageUrl: item_data.target_path,

    // Info
    category:     item_data.category,
    subcategory1: item_data.subcategory1,
    subcategory2: item_data.subcategory2,
    color:        item_data.color
  };

  const options = {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(item_model)
  };

  try {
    const response = await fetch(api_url, options);
    if (!response.ok) {
      throw new Error("Network response was not ok", response.message);
    }
    const data = await response.json();
    console.log("POST request successful");
    console.log(data);
  } catch (error) {
    console.error("There was a problem with the POST request:", error);
  }

  add_item(index + 1, api_url);
}

// -----------------------------------------------------------------------------
// Parse command line and read the data
if(process.argv.length != 3) {
  console.log(`Usage: ${process.argv[1]} items.json`);
  process.exit(1);
}

const ITEMS_JSON_PATH = process.argv[2];
const ITEMS_STR       = FSUtils.ReadAllFileSync(ITEMS_JSON_PATH);
const ITEMS_DATA      = JSON.parse(ITEMS_STR);

// -----------------------------------------------------------------------------
// Add the item...
const API_URL = `${process.env.HOST}:${process.env.PORT}/moodboard-items`;

add_item(0, API_URL);
