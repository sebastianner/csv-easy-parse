import path from "path";

export default function pathFinder(folder: string): string {
  const dirname: string = new URL(".", import.meta.url).pathname;
  const parentDir: string = path.dirname(dirname);
  return path.join(parentDir, folder);
}
