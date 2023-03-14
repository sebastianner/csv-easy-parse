import fs from "fs";
import type { PathLike } from "fs";
import type { CsvToObject } from "../interfaces/interfaces.js";

export async function parser(cvsUrl: PathLike): Promise<CsvToObject> {
	const cvsToObject: CsvToObject = {};
	const fileName: string[] = [];
	const files = await fs.promises.readdir(cvsUrl);
	fileName.push(files[0]);
	const cvs = await fs.promises.readFile(cvsUrl + `/${fileName[0]}`, {
		encoding: "utf-8",
	});
	const rows: string[] = cvs.trim().split("\n");
	const headers: string[] = rows.shift().split(",");
	headers.forEach((header, index) => {
		cvsToObject[header] = [];
		rows.forEach((row) => {
			const ObjectVal: string[] | number[] = row.split(",");
			cvsToObject[header].push(ObjectVal[index]);
		});
	});
	return cvsToObject;
}
