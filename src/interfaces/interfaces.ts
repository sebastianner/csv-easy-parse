export interface CsvToObject {
	[key: string]: {
		[key: string]: Array<string | number>;
	};
}

export interface DynamicObject {
	[keys: string]: string;
}

export interface UnzipperResults {
	zipContents: DynamicObject;
	entryNames: string[];
}

export interface DownloaderResults {
	unzipperResults: UnzipperResults;
	bufferToString: DynamicObject;
}

export interface ParserClass extends DownloaderResults {
	typeVal(): CsvToObject;
}
