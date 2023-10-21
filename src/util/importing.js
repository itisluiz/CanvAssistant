import { readdir, readFile, writeFile } from 'fs/promises';
import { join } from 'path';

export async function importDirectory(directoryPath, extension = '.js')
{
	const files = await readdir(directoryPath);
	const jsFiles = files.filter(file => file.endsWith(extension));

	const importPromises = jsFiles.map(async (file) => {
		const filePath = join(directoryPath, file);
		// Magic "../../" relative path, anything but concatenation with + doesn't work.
		return await import('../../' + filePath);
	});

	return await Promise.all(importPromises);;
}

export async function checkUpdateHash(hashFilePath, expectedHash)
{
	const containedHash = await readFile(hashFilePath, 'utf-8');

	if (expectedHash === containedHash)
		return true;
	else
		await writeFile(hashFilePath, expectedHash, { encoding: 'utf-8', flag: 'w' });

	return false;
}
