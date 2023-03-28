import { downloader } from "./services/downloader.js";
import { parse } from "./services/csv-parser.js";
import { pathResolver } from "./utils/pathResolver.js";
import type { DynamicObject } from "./interfaces/interfaces.js";
import path from "path";
import fs from "fs";

export async function fromZipUrl(
	url: string,
	separator = ","
): Promise<string[]> {
	const { unzipperResults } = await downloader(url).catch((error) => {
		console.error(`Error in fromZipUrl unzipperResults: ${error}`);
		throw new Error("Could not download the CSV file");
	});
	const returnValues: string[] = [];
	const zipContents: DynamicObject = unzipperResults?.zipContents;
	const parsePromise: Promise<string>[] = [];
	for (const zipContent in zipContents) {
		const entryName = path.basename(zipContent);
		const cvsObject: DynamicObject = {};
		cvsObject[entryName] = zipContents[zipContent];

		const parsedCsv = parse(cvsObject, separator).catch((error) => {
			console.error(`Error in fromZipUrl parsedCsv: ${error}`);
			throw new Error("Could not process the CSV file");
		});
		parsePromise.push(parsedCsv);
	}

	return Promise.allSettled(parsePromise).then((results) => {
		results.forEach((result) => {
			if (result.status !== "fulfilled") {
				return Promise.reject(result.reason);
			}
			returnValues.push(result.value);
		});
		return returnValues;
	});
}

export async function fromCsvUrl(
	url: string,
	separator = ","
): Promise<string> {
	const { bufferToString } = await downloader(url).catch((error) => {
		console.error(`Error in fromCsvUrl bufferToString: ${error}`);
		throw new Error("Could not download the CSV file");
	});
	const parsedCsv = await parse(bufferToString, separator).catch((error) => {
		console.error(`Error in fromCsvUrl parsedCsv: ${error}`);
		throw new Error("Could not process the CSV file");
	});
	return parsedCsv;
}

export async function fromLocalPath(
	localPath: string,
	separator = ","
): Promise<string> {
	const resolvePath: string = pathResolver(localPath);
	const readCvs: string = await fs.promises
		.readFile(resolvePath, {
			encoding: "utf8",
		})
		.catch((error) => {
			console.error(`Error in fromLocalPath readCvs: ${error}`);
			throw new Error("Could not process the CSV file");
		});
	const entryName: string = path.basename(localPath);
	const cvsObject: DynamicObject = {};
	cvsObject[entryName] = readCvs;
	const parsedCsv = await parse(cvsObject, separator).catch((error) => {
		console.error(`Error in fromLocalPath parsedCsv: ${error}`);
		throw new Error("Could not process the CSV file");
	});
	return parsedCsv;
}

export async function fromManyLocalPath(
	localPaths: string[]
): Promise<string[]> {
	//declare file names
	const entryNames: string[] = [];

	// Extract the relative or absolute path if it contains a separator
	const rawPaths = localPaths.map((path) => path.split(" ")[0]);

	// split separator from path
	const separators = localPaths.map((path) => path.split(" ")[1]);

	//declare constant that will contain parsed objects
	const returnValues: string[] = [];

	// convert relative paths to absolte paths and push entryNames
	const resolvedPaths = rawPaths.map((rawPath) => {
		entryNames.push(path.basename(rawPath));
		return pathResolver(rawPath);
	});

	// Array containing all the pending promises from fs.promise.readFile
	const declarePathPromises = resolvedPaths.map((path) =>
		fs.promises.readFile(path, {
			encoding: "utf8",
		})
	);

	//Array containing all the read files from fs.promise.readFile
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
			return parse(cvsObject, separators[index]);
		} else {
			return Promise.reject(pathResult.reason);
		}
	});

	// Resolve declareParsePromises and pushing its values to the returnValue Array and then returning it
	return Promise.allSettled(declareParsePromises).then((results) => {
		results.forEach((value) => {
			if (value.status !== "fulfilled") {
				return Promise.reject(value.reason);
			}
			returnValues.push(value.value);
		});
		return returnValues;
	});
}
