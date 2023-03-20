import https from "https";
import { unzipper } from "../utils/unziper.js";
import type {
	DownloaderResults,
	UnzipperResults,
} from "../interfaces/interfaces.js";

export function downloader(url: string): Promise<DownloaderResults> {
	return new Promise((resolve, reject) => {
		https.get(url, (res): void => {
			const data: Array<Buffer> = [];
			res
				.on("error", reject)
				.on("data", (chunk) => {
					data.push(chunk);
				})
				.on("end", (): void => {
					const buffer: Buffer = Buffer.concat(data);
					const fileType: string = res.headers["content-type"].split("/")[1];
					const downloaderResults: DownloaderResults = {
						unzipperResults: undefined,
						buffer: undefined,
					};
					if (fileType === "zip") {
						const unzipped: UnzipperResults = unzipper(buffer);
						downloaderResults.unzipperResults = unzipped;
						resolve(downloaderResults);
					} else {
						downloaderResults.buffer = buffer;
						resolve(downloaderResults);
					}
					// TODO: Error handling
					// console.error("Wrong file type!");
				});
		});
	});
}
