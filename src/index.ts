import fs from "fs";
import { downloader } from "./services/downloader.js";
import { pathFinder } from "./utils/pathFinder.js";
import { Parser } from "./services/cvs-parser.js";
import { constants } from "./config/constants.js";
import type { DownloaderResults } from "./interfaces/interfaces.js";

async function cvsInterpreter() {
	const cvsFilePath: string = pathFinder("cvsFiles");
	if (!fs.existsSync(cvsFilePath)) {
		console.log(`Creating new zip folder at ${cvsFilePath}...`);
		fs.mkdirSync(cvsFilePath);
	}
	const contents: DownloaderResults = await downloader(constants.altZip);
	const cvsParsed: Parser = new Parser(
		contents.unzipperResults,
		contents.buffer
	);
	console.log(cvsParsed.typeVal());
}

cvsInterpreter();
