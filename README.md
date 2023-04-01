CSV file interpreter that will download a csv from a given URL, unzip it if necessary, and then it will serve the data in a simple JSON to make charts or manipulate the data as pleased written in typescript, lightweight, currently the only dependency is adm-zip to unzip the files.

npm module at https://www.npmjs.com/package/csv-easy-parse

# Usage

## Functions

### fromZipUrl

Function to parse a CSV file from a URL pointing to a ZIP archive containing one or more CSV files

#### Parameters

- `url` - The URL pointing to the ZIP file
- `separator` - The separator used in the CSV file (default: comma)

#### Returns

A Promise that resolves to the parsed CSV data as an Array of JSON.

#### Throws

If the CSV file could not be read or processed.

Example usage with try-catch exception handling:

`
try {
  const csvData = await fromZipUrl('https://example.com/csv.zip', ';');
  console.log(csvData);
} catch (error) {
  console.error(error);
}`

### fromCsvUrl

Function to parse a single CSV file from a URL

#### Parameters

- `url` - The URL pointing to the CSV file
- `separator` - The separator used in the CSV file (default: comma)

#### Returns

A Promise that resolves to the parsed CSV data as a JSON.

#### Throws

If the CSV file could not be read or processed.

Example usage with try-catch exception handling:

`
try {
  const csvData = await fromCsvUrl('https://example.com/data.csv', '|');
  console.log(csvData);
} catch (error) {
  console.error(error);
}`
### fromLocalPath

Read a CSV file from a local path and parse it

#### Parameters

- `localPath` - The local path of the CSV file
- `separator` - The separator used in the CSV file (default: comma)

#### Returns

A Promise that resolves to the parsed CSV data as a JSON.

#### Throws

If the CSV file could not be read or processed.

Example usage with try-catch exception handling:

`
try {
  const csvData = await fromLocalPath('/path/to/file.csv', ';');
  console.log(csvData);
} catch (error) {
  console.error(error);
}`
### fromManyLocalPath

Read multiple CSV files from local paths and parse them

#### Parameters

- `localPaths` - String array containing all the paths pointing to the CSV files. 
Each string in the array can also include the separator for the respective CSV file, 
which should be separated from the path by a space. If no separator is declared, 
the default separator (comma) will be used.

#### Returns

A Promise that resolves to the parsed CSV data as an Array of JSON.

#### Throws

If any of the CSV files could not be read or processed.

Example usage with try-catch exception handling:

`
try {
  const csvData = await fromManyLocalPath(['/path/to/file1.csv', '/path/to/file2.csv ;', '/path/to/file3.csv |']);
  console.log(csvData);
} catch (error) {
  console.error(error);
}`
