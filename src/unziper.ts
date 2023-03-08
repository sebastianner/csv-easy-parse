import AdmZip from "adm-zip";
import pathFinder from "./utils/pathFinder.js";

export default function unziper(buffer: Buffer): void {
	const zip: AdmZip = new AdmZip(buffer);
	const cvsFilePath: string = pathFinder("cvsFiles");

	zip.extractAllTo(cvsFilePath, true);
	console.log(`Zip file extracted at ${cvsFilePath}...`);
}
