import https from "https";
import { unziper } from "../utils/unziper.js";
import { pathFinder } from "../utils/pathFinder.js";
import path from "path";
import fs from "fs";

export function downloader(url: string): Promise<void> {
	return new Promise((resolve, reject) => {
		https.get(url, (res): void => {
			const data: Array<Buffer> = [];
			res
				.on("error", reject)
				.on("data", (chunk) => {
					data.push(chunk);
				})
				.on("end", async (): Promise<void> => {
					const buffer = Buffer.concat(data);
					const fileType: string = res.headers["content-type"].split("/")[1];

					if (fileType === "zip") {
						unziper(buffer);
						resolve();
					} else {
						await fs.promises.writeFile(
							pathFinder("cvsFiles") + `/${path.basename(url)}.cvs`,
							buffer
						);
						resolve();
					}
					// TODO: Error handling
					// console.error("Wrong file type!");
				});
		});
	});
}
