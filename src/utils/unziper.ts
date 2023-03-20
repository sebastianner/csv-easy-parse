import AdmZip from "adm-zip";
import type { Buffer } from "buffer";
import type { IZipEntry } from "adm-zip";
import type {
	DynamicObject,
	UnzipperResults,
} from "../interfaces/interfaces.js";

export function unzipper(buffer: Buffer): UnzipperResults {
	const zip: AdmZip = new AdmZip(buffer);
	const entries: IZipEntry[] = zip.getEntries();
	const zipContents: DynamicObject = {};
	const entryNames: string[] = [];
	for (const entry of entries) {
		const content = entry.getData().toString("utf8");
		entryNames.push(entry.entryName);
		zipContents[entry.entryName] = content;
	}
	return { zipContents, entryNames };
}
