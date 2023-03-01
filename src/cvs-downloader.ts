import https from "https";
import constants from "./constants.js";
import AdmZip from "adm-zip";
import path from "path";
import fs from "fs";
import { fileTypeFromBuffer, FileTypeResult } from "file-type";

function unziper(buffer: Buffer): void {
  const zip: AdmZip = new AdmZip(buffer);
  const dirname: string = new URL(".", import.meta.url).pathname;

  const zipFilePath = path.join(dirname, "zipFiles");
  if (!fs.existsSync(zipFilePath)) {
    console.log(`Creating new zip folder at ${zipFilePath}...`);
    fs.mkdirSync(zipFilePath);
  }
  zip.extractAllTo(zipFilePath, true);
  console.log(`Zip file extracted at ${zipFilePath}...`);
}

function downloader() {
  https.get(constants.cvsUrl, (res): void => {
    const data: Array<Buffer> = [];
    res
      .on("data", (chunk) => {
        data.push(chunk);
      })
      .on("end", async (): Promise<void> => {
        let buffer = Buffer.concat(data);
        const fileType: FileTypeResult = await fileTypeFromBuffer(buffer);
        if (fileType.ext !== "zip") {
          // TODO: Error handling
          console.error("Wrong file type!");
          return null;
        }
        unziper(buffer);
      });
  });
}

export default downloader;
