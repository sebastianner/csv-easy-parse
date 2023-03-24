import { downloader } from "./services/downloader.js";
import { parse } from "./services/cvs-parser.js";
import type {
	CsvToObject,
	DownloaderResults,
	DynamicObject,
} from "./interfaces/interfaces.js";
import { constants } from "./config/constants.js";

export async function fromZipUrl(
	url: string,
	separator = ","
): Promise<CsvToObject> {
	const contents: DownloaderResults = await downloader(url);
	const zipContents: DynamicObject = contents.unzipperResults.zipContents;
	return parse(zipContents, separator);
}

export async function fromCvsUrl(
	url: string,
	separator = ","
): Promise<CsvToObject> {
	const contents: DownloaderResults = await downloader(url);
	return parse(contents.bufferToString, separator);
}

const x = await fromCvsUrl(constants.cvsUrl, ";");
const y = await fromZipUrl(constants.altZip);
console.log(x, y);
