import https from "https";
import constants from "./constants.js";
import unziper from "./unziper.js";
import pathFinder from "./utils/pathFinder.js";
import fs from "fs";
import path from "path";

function downloader() {
  const url: string = constants.zipUrl;
  https.get(url, (res): void => {
    const data: Array<Buffer> = [];
    res
      .on("data", (chunk) => {
        data.push(chunk);
      })
      .on("end", (): Promise<void> => {
        let buffer = Buffer.concat(data);
        const fileName: string = path.basename(url);
        const fileType: string = res.headers["content-type"].split("/")[1];

        if (fileType === "zip") {
          unziper(buffer);
          return null;
        }
        fs.writeFile(
          pathFinder("cvsFiles") + `/${fileName}`,
          buffer,
          (err) => err
        );
        // TODO: Error handling
        // console.error("Wrong file type!");
      });
  });
}

export default downloader;
