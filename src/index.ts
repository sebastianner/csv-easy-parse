import fs from "fs";
import downloader from "./cvs-downloader.js";
import pathFinder from "./utils/pathFinder.js";

function cvsInterpreter() {
  const cvsFilePath: string = pathFinder("cvsFiles");
  if (!fs.existsSync(cvsFilePath)) {
    console.log(`Creating new zip folder at ${cvsFilePath}...`);
    fs.mkdirSync(cvsFilePath);
  }
  downloader();
}

cvsInterpreter();
