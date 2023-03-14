import AdmZip from "adm-zip";
import { pathFinder } from "./pathFinder.js";

export function unziper(buffer: Buffer): void {
	const zip: AdmZip = new AdmZip(buffer);
	const cvsFilePath: string = pathFinder("cvsFiles");

	zip.extractAllTo(cvsFilePath, false);
	console.log(`Zip file extracted at ${cvsFilePath}...`);
}
