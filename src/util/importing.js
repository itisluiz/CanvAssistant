import { readdir } from 'fs/promises';
import { join, extname } from 'path';

async function importDirectory(directoryPath)
{
	const files = await readdir(directoryPath);
	const jsFiles = files.filter(file => extname(file) === '.js');

	const importPromises = jsFiles.map(async (file) => {
		const filePath = join(directoryPath, file);
		// Magic "../../" relative path, anything but concatenation with + doesn't work.
		return await import('../../' + filePath);
	});

	return await Promise.all(importPromises);;
}

export { importDirectory };
