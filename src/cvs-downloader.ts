import https from "https";
import constants from "./config/constants.js";
import unziper from "./unziper.js";
import pathFinder from "./utils/pathFinder.js";
import fs from "fs";
import path from "path";

function downloader() {
	const url: string = constants.zipUrl;
	const cvsFilePath: string = pathFinder("cvsFiles");
	https.get(url, (res): void => {
		const data: Array<Buffer> = [];
		res
			.on("data", (chunk) => {
				data.push(chunk);
			})
			.on("end", (): void => {
				const buffer = Buffer.concat(data);
				const fileName: string = path.basename(url);
				const fileType: string = res.headers["content-type"].split("/")[1];

				if (fileType === "zip") {
					unziper(buffer);
				} else {
					fs.writeFile(
						pathFinder("cvsFiles") + `/${fileName}`,
						buffer,
						(err) => err
					);
				}
				fs.readFile(
					cvsFilePath + "/business-financial-data-september-2022-quarter.csv",
					"utf8",
					(_, data) => {
						console.log(data.trim().split("\n"));
					}
				);

				// TODO: Error handling
				// console.error("Wrong file type!");
			});
	});
}

export default downloader;
