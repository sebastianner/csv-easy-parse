import path from "path";

export function pathResolver(filePath: string): string {
	if (path.isAbsolute(filePath)) {
		return filePath;
	}

	const dirname: string = new URL(".", import.meta.url).pathname;
	const parentDir: string = path.dirname(dirname);
	return path.join(parentDir, filePath);
}
