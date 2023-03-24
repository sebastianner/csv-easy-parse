import type { CsvToObject, DynamicObject } from "../interfaces/interfaces.js";

export function parse(contents: DynamicObject, separator: string): CsvToObject {
	const cvsToObject: CsvToObject = {};

	for (const content in contents) {
		const cvs: string = contents[content];
		const rows: string[] = cvs.trim().split("\n");
		const headers: string[] = rows.shift().split(separator);
		cvsToObject[content] = [];
		headers.forEach((header, headerIndex) => {
			cvsToObject[content][header] = [];
			rows.forEach((row) => {
				const ObjectVal: string[] | number[] = row.split(separator);
				cvsToObject[content][header].push(ObjectVal[headerIndex]);
			});
		});
	}

	return cvsToObject;
}
