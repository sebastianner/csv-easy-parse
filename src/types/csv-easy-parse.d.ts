declare module "csv-easy-parse" {
	export function fromZipUrl(url: string, separator: string): Promise<string>;

	export function fromCsvUrl(url: string, separator: string): Promise<string>;

	export function fromLocalPath(
		url: string,
		separator: string
	): Promise<string>;

	export function fromManyLocalPath(
		url: string,
		separator: string
	): Promise<string>;
}
