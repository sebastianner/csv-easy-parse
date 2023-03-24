import { downloader } from "./services/downloader.js";
import { parse } from "./services/csv-parser.js";
import { pathResolver } from "./utils/pathResolver.js";
import type {
	CsvToObject,
	DownloaderResults,
	DynamicObject,
} from "./interfaces/interfaces.js";
import path from "path";
import fs from "fs";

export async function fromZipUrl(
	url: string,
	separator = ","
): Promise<CsvToObject> {
	const contents: DownloaderResults = await downloader(url);
	const zipContents: DynamicObject = contents.unzipperResults.zipContents;
	return parse(zipContents, separator);
}

export async function fromCsvUrl(
	url: string,
	separator = ","
): Promise<CsvToObject> {
	const contents: DownloaderResults = await downloader(url);
	return parse(contents.bufferToString, separator);
}

export async function fromLocalPath(
	localPath: string,
	separator = ","
): Promise<CsvToObject> {
	const resolvePath: string = pathResolver(localPath);
	const readCvs: string = await fs.promises.readFile(resolvePath, {
		encoding: "utf8",
	});
	const entryName: string = path.basename(localPath);
	const cvsObject: DynamicObject = {};
	cvsObject[entryName] = readCvs;
	return parse(cvsObject, separator);
}
