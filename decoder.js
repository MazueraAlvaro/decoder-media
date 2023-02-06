const fs = require("fs");
const path = "video.mp4";

const readable = fs.createReadStream("base64.txt", {
  encoding: "utf8",
});
const writeable = fs.createWriteStream(path, "base64");
let base64Chunk = "";
readable.on("data", (chunk) => {
  const search = "data:video/mp4;base64,";
  const find = chunk.indexOf(search);
  if (find > -1) {
    base64Chunk += chunk.substring(0, find).replace(/\n/g, "");
    if (base64Chunk != "") {
      writeable.write(base64Chunk);
    }
    base64Chunk = chunk.substring(find + search.length);
  } else {
    base64Chunk += chunk;
  }
});
readable.on("end", () => {
  writeable.write(base64Chunk);
  writeable.close();
});
