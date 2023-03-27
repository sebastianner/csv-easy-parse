import { downloader } from "./services/downloader.js";
import { parse } from "./services/csv-parser.js";
import { pathResolver } from "./utils/pathResolver.js";
import type { DynamicObject } from "./interfaces/interfaces.js";
import path from "path";
import fs from "fs";

export async function fromZipUrl(
	url: string,
	separator = ","
): Promise<string> {
	const { unzipperResults } = await downloader(url);
	const zipContents: DynamicObject = unzipperResults?.zipContents;
	return await parse(zipContents, separator);
}

export async function fromCsvUrl(
	url: string,
	separator = ","
): Promise<string> {
	const { bufferToString } = await downloader(url);
	return await parse(bufferToString, separator);
}

export async function fromLocalPath(
	localPath: string,
	separator = ","
): Promise<string> {
	const resolvePath: string = pathResolver(localPath);
	const readCvs: string = await fs.promises.readFile(resolvePath, {
		encoding: "utf8",
	});
	const entryName: string = path.basename(localPath);
	const cvsObject: DynamicObject = {};
	cvsObject[entryName] = readCvs;
	return await parse(cvsObject, separator);
}

export async function fromManyLocalPath(
	localPaths: string[],
	separator = ","
): Promise<string[]> {
	//declare file names
	const entryNames: string[] = [];

	//declare constant that will contain parsed objects
	const returnValues: string[] = [];

	// convert relative paths to absolte paths
	const resolvedPaths = localPaths.map((rawPath) => {
		entryNames.push(path.basename(rawPath));
		return pathResolver(rawPath);
	});

	// Array containing all the pending promises from fs.promise.readFile
	const declarePathPromises = resolvedPaths.map((path) =>
		fs.promises.readFile(path, {
			encoding: "utf8",
		})
	);

	//Array containing all the resolved promises from fs.promise.readFile
	const resolvePathPromises = await Promise.allSettled(declarePathPromises);

	// Array containing all the pending promises from parse()
	const declareParsePromises = entryNames.map((entry, index) => {
		const cvsObject: DynamicObject = {};
		const pathResult = resolvePathPromises[index];
		if (pathResult?.status === "fulfilled") {
			const pathValue = pathResult?.value;
			if (typeof pathValue !== "string") {
				throw new Error(`File at path ${resolvedPaths[index]} is not a string`);
			}
			cvsObject[entry] = pathValue;
			return parse(cvsObject, separator);
		} else {
			return Promise.reject(pathResult.reason);
		}
	});

	// Resolve declareParsePromises and pushing their values to the returnValue Array and then returning it
	return Promise.allSettled(declareParsePromises).then((values) => {
		values.forEach((value) => {
			if (value.status === "fulfilled") {
				returnValues.push(value.value);
			}
		});
		return returnValues;
	});
}
