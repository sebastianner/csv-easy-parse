import fs from "fs";
import { downloader } from "./services/downloader.js";
import { pathFinder } from "./utils/pathFinder.js";
import { parser } from "./services/cvs-parser.js";
import { constants } from "./config/constants.js";

async function cvsInterpreter() {
	const cvsFilePath: string = pathFinder("cvsFiles");
	if (!fs.existsSync(cvsFilePath)) {
		console.log(`Creating new zip folder at ${cvsFilePath}...`);
		fs.mkdirSync(cvsFilePath);
	}
	await downloader(constants.zipUrl);
	const cvsParsed = await parser(pathFinder("cvsFiles"));
	console.log(cvsParsed);
}

cvsInterpreter();
