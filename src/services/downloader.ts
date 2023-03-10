import https from "https";
import unziper from "../utils/unziper.js";
import pathFinder from "../utils/pathFinder.js";
import path from "path";
import fs from "fs";

export default function downloader(url: string) {
	https.get(url, (res): void => {
		const data: Array<Buffer> = [];
		res
			.on("data", (chunk) => {
				data.push(chunk);
			})
			.on("end", (): void => {
				const buffer = Buffer.concat(data);
				const fileType: string = res.headers["content-type"].split("/")[1];

				if (fileType === "zip") {
					unziper(buffer);
				} else {
					fs.writeFile(
						pathFinder("cvsFiles") + `/${path.basename(url)}.cvs`,
						buffer,
						(err) => err
					);
				}
				// TODO: Error handling
				// console.error("Wrong file type!");
			});
	});
}
