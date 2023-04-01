import path from "path";

export function pathResolver(filePath: string): string {
	return path.resolve(filePath);
}
