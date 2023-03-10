import fs from "fs";
import downloader from "./services/downloader.js";
import pathFinder from "./utils/pathFinder.js";
import constants from "./config/constants.js";

function cvsInterpreter() {
	const cvsFilePath: string = pathFinder("cvsFiles");
	if (!fs.existsSync(cvsFilePath)) {
		console.log(`Creating new zip folder at ${cvsFilePath}...`);
		fs.mkdirSync(cvsFilePath);
	}
	downloader(constants.zipUrl);
}

cvsInterpreter();
