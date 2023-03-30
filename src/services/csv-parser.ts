import type { CsvToObject, DynamicObject } from "../interfaces/interfaces.js";

export function parse(
	content: DynamicObject,
	separator: string
): Promise<string> {
	return new Promise((resolve, reject) => {
		if (!content) {
			reject("No object defined to parse");
		}
		const csvToObject: CsvToObject = {};
		const csvKey: string = Object.keys(content)[0];
		const csv: string = Object.values(content)[0];
		const rows: string[] | undefined = csv.trim().split("\r");
		const headers: string[] | undefined = rows?.shift()?.split(separator);
		csvToObject[csvKey] = {};
		headers?.forEach((header: string, headerIndex: number) => {
			csvToObject[csvKey][header] = [];
			rows?.forEach((row) => {
				const splitN = row.split("\n")[1];
				const ObjectVal: string[] | number[] = splitN.split(separator);
				csvToObject[csvKey][header].push(ObjectVal[headerIndex]);
			});
		});

		resolve(JSON.stringify(csvToObject));
	});
}
