export interface CsvToObject {
	[key: string]: DynamicObject | string[];
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
	bufferToString: DynamicObject | undefined;
}

export interface ParserClass extends DownloaderResults {
	typeVal(): CsvToObject;
}
