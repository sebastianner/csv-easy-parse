import { downloader } from "./services/downloader.js";
import { parse } from "./services/csv-parser.js";
import { pathResolver } from "./utils/pathResolver.js";
import type { DynamicObject } from "./interfaces/interfaces.js";
import path from "path";
import fs from "fs";

/**
Function to parse a CSV file from a URL pointing to a ZIP archive containing one or more CSV files
@param url - The URL pointing to the ZIP file
@param separator - The separator used in the CSV file (default: comma)
@returns - A Promise that resolves to the parsed CSV data as an Array
@throws - If the CSV file could not be read or processed
*/
export async function fromZipUrl(
	url: string,
	separator = ","
): Promise<string[]> {
	const { unzipperResults } = await downloader(url).catch((error) => {
		console.error(`Error in fromZipUrl unzipperResults: ${error}`);
		return Promise.reject(new Error("Could not download the ZIP file"));
	});

	// Get the contents of the ZIP archive
	const zipContents: DynamicObject = unzipperResults?.zipContents;
	// Initialize an array of Promises to parse each CSV file in the ZIP archive
	const parsePromise: Promise<string>[] = [];

	// Loop through each entry in the ZIP archive
	for (const zipContent in zipContents) {
		// Get the name of the CSV file
		const entryName = path.basename(zipContent);
		// Create an object to store the CSV content
		const cvsObject: DynamicObject = {};
		cvsObject[entryName] = zipContents[zipContent];
		// Parse the CSV content and add the resulting Promise to the parsePromise array
		const parsedCsv = parse(cvsObject, separator).catch((error) => {
			console.error(`Error in fromZipUrl parsedCsv: ${error}`);
			return Promise.reject(
				new Error(`Could not process the CSV file: ${zipContent}`)
			);
		});
		parsePromise.push(parsedCsv);
	}
	// Wait for all the CSV files to be parsed and add their results to the returnValues array
	return Promise.allSettled(parsePromise).then((results) => {
		// Initialize an array to store the parsed CSV contents
		const returnValues: string[] = [];
		results.forEach((value) => {
			if (value.status !== "fulfilled") {
				const rejectedObject: string = JSON.stringify({
					status: "rejected",
					reason: value.reason?.message,
				});
				returnValues.push(rejectedObject);
			} else {
				returnValues.push(value.value);
			}
		});
		return returnValues;
	});
}

/**
Function to parse a single CSV file from a URL
@param url - The URL pointing to the CSV file
@param separator - The separator used in the CSV file (default: comma)
@returns - A Promise that resolves to the parsed CSV data as a string
@throws - If the CSV file could not be read or processed
*/
export async function fromCsvUrl(
	url: string,
	separator = ","
): Promise<string> {
	const { bufferToString } = await downloader(url).catch((error) => {
		console.error(`Error in fromCsvUrl bufferToString: ${error}`);
		return Promise.reject(new Error("Could not download the CSV file"));
	});
	// Parse the CSV content
	const parsedCsv = await parse(bufferToString, separator).catch((error) => {
		console.error(`Error in fromCsvUrl parsedCsv: ${error}`);
		return Promise.reject(
			new Error(
				`Could not process the CSV file: ${Object.keys(bufferToString)}`
			)
		);
	});
	return parsedCsv;
}

/**
Read a CSV file from a local path and parse it
@param localPath - The local path of the CSV file
@param separator - The separator used in the CSV file (default: comma)
@returns - A Promise that resolves to the parsed CSV data as a string
@throws - If the CSV file could not be read or processed
*/
export async function fromLocalPath(
	localPath: string,
	separator = ","
): Promise<string> {
	// Resolve the path to the CSV file
	const resolvePath: string = pathResolver(localPath);

	// Read the CSV file as a string
	const readCvs: string = await fs.promises
		.readFile(resolvePath, {
			encoding: "utf8",
		})
		.catch((error) => {
			console.error(`Error in fromLocalPath readCvs: ${error}`);
			return Promise.reject(
				new Error(`Could not read the CSV file at: ${resolvePath}`)
			);
		});

	// Create an object with the CSV file contents
	const entryName: string = path.basename(localPath);
	const cvsObject: DynamicObject = {};
	cvsObject[entryName] = readCvs;

	// Parse the CSV file
	const parsedCsv = await parse(cvsObject, separator).catch((error) => {
		console.error(`Error in fromLocalPath parsedCsv: ${error}`);
		return Promise.reject(new Error("Could not process the CSV file"));
	});

	return parsedCsv;
}

/**
 * Read a CSV file from a local path and parse it
 * @param localPaths - String Array that contains all the paths pointing to the CSV files.
 * Additionally, if the file contains a specific separator, this could be declared within the string with a space and the separator. E.g '../files/file.csv ;'
 * If not declared, the default separator will be a comma.
 * @returns - A Promise that resolves to the parsed CSV data as an Array
 * @throws - If the CSV file could not be read or processed
 */
export async function fromManyLocalPath(
	localPaths: string[]
): Promise<string[]> {
	//declare file names
	const entryNames: string[] = [];

	// Extract the relative or absolute path if it contains a separator
	const rawPaths = localPaths.map((path) => path.split(" ")[0]);

	// split separator from path
	const separators = localPaths.map((path) => path.split(" ")[1]);

	// convert relative paths to absolte paths and push entryNames
	const resolvedPaths = rawPaths.map((rawPath) => {
		entryNames.push(path.basename(rawPath));
		return pathResolver(rawPath);
	});

	// Array containing all the pending promises from fs.promise.readFile
	const declarePathPromises = resolvedPaths.map((path) =>
		fs.promises
			.readFile(path, {
				encoding: "utf8",
			})
			.catch((error) => {
				console.error(
					`Error in fromManyLocalPath declarePathPromises: ${error}`
				);
				return Promise.reject(
					new Error(
						`Could not read the CSV file at: ${path}, make sure it exists and it is a csv file`
					)
				);
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
				return Promise.reject(
					`File at path ${resolvedPaths[index]} is not a string`
				);
			}
			cvsObject[entry] = pathValue;
			return parse(cvsObject, separators[index]);
		}
		return Promise.reject(pathResult.reason);
	});

	// Resolve declareParsePromises and pushing its values to the returnValue Array and then returning it
	return Promise.allSettled(declareParsePromises).then((results) => {
		//declare constant that will contain parsed objects
		const returnValues: string[] = [];
		results.forEach((value) => {
			if (value.status !== "fulfilled") {
				const rejectedObject: string = JSON.stringify({
					status: "rejected",
					reason: value.reason?.message,
				});
				returnValues.push(rejectedObject);
			} else {
				returnValues.push(value.value);
			}
		});
		return returnValues;
	});
}
