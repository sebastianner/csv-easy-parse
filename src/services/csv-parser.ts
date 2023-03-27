import type { CsvToObject, DynamicObject } from "../interfaces/interfaces.js";

export function parse(
	contents: DynamicObject,
	separator: string
): Promise<string> {
	return new Promise((resolve, reject) => {
		if (!contents) {
			reject("No object defined to parse");
		}
		const csvToObject: CsvToObject = {};

		for (const content in contents) {
			const csv: string = contents[content];
			const rows: string[] | undefined = csv.trim().split("\n");
			const headers: string[] | undefined = rows?.shift()?.split(separator);
			csvToObject[content] = {};
			headers?.forEach((header: string, headerIndex: number) => {
				csvToObject[content][header] = [];
				rows?.forEach((row) => {
					const ObjectVal: string[] | number[] = row.split(separator);
					csvToObject[content][header].push(ObjectVal[headerIndex]);
				});
			});
		}

		resolve(JSON.stringify(csvToObject));
	});
}
