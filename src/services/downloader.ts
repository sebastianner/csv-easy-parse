import https from "https";
import { unzipper } from "../utils/unziper.js";
import path from "path";
import type {
	DownloaderResults,
	UnzipperResults,
	DynamicObject,
} from "../interfaces/interfaces.js";

export function downloader(url: string): Promise<DownloaderResults> {
	return new Promise((resolve, reject) => {
		https.get(url, (res): void => {
			const data: Buffer[] = [];

			if (res.statusCode !== 200) {
				return reject(`${res?.statusCode?.toString()} ${res?.statusMessage}`);
			}
			res
				.on("error", reject)
				.on("data", (chunk) => {
					// focus on streams for the future
					data.push(chunk);
				})
				.on("end", (): void => {
					const buffer: Buffer = Buffer.concat(data);
					const fileType: string | undefined =
						res?.headers["content-type"]?.split("/")[1];
					const downloaderResults: DownloaderResults = {
						unzipperResults: { zipContents: {}, entryNames: [] },
						bufferToString: {},
					};
					if (fileType === "zip") {
						const unzipped: UnzipperResults = unzipper(buffer);
						downloaderResults.unzipperResults = unzipped;
						resolve(downloaderResults);
					} else {
						const objectMock: DynamicObject = {};
						const baseName: string = path.basename(url);
						objectMock[baseName] = buffer.toString("utf8");
						downloaderResults.bufferToString = objectMock;
						resolve(downloaderResults);
					}
				});
		});
	});
}
