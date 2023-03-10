import fs from "fs";
import type { PathLike } from "fs";

export function parser(cvsUrl: PathLike) {
	const fileName: Array<string> = [];
	fs.readdir(cvsUrl, (_, files) => {
		fileName.push(files[0]);
		fs.readFile(cvsUrl + `/${fileName[0]}`, "utf8", (_, data) => {
			console.log(data.trim().split("\n"));
		});
	});
}
