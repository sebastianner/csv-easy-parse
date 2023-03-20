import { Buffer } from "buffer";
import type {
	CsvToObject,
	UnzipperResults,
	ParserClass,
	DynamicObject,
} from "../interfaces/interfaces.js";

export class Parser implements ParserClass {
	constructor(public unzipperResults: UnzipperResults, public buffer: Buffer) {}

	private parse(contents: DynamicObject): CsvToObject {
		const cvsToObject: CsvToObject = {};

		for (const content in contents) {
			const cvs: string = contents[content];
			const rows: string[] = cvs.trim().split("\n");
			const headers: string[] = rows.shift().split(",");
			cvsToObject[content] = [];
			headers.forEach((header, headerIndex) => {
				cvsToObject[content][header] = [];
				rows.forEach((row) => {
					const ObjectVal: string[] | number[] = row.split(",");
					cvsToObject[content][header].push(ObjectVal[headerIndex]);
				});
			});
		}

		return cvsToObject;
	}

	public typeVal(): CsvToObject {
		if (this.unzipperResults) {
			return this.parse(this.unzipperResults.zipContents);
		} else {
			const objectMock: DynamicObject = {
				content: this.buffer.toString("utf8"),
			};
			return this.parse(objectMock);
		}
	}
}

//TODO SPLIT separator
