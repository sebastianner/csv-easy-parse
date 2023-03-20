export interface CsvToObject {
	[key: string]: (string | number)[];
}

export interface DynamicObject {
	[keys: string]: string;
}

export interface UnzipperResults {
	zipContents: DynamicObject;
	entryNames: string[];
}

export interface DownloaderResults {
	unzipperResults: UnzipperResults | undefined;
	buffer: Buffer | undefined;
}

export interface ParserClass extends DownloaderResults {
	typeVal(): CsvToObject;
}
