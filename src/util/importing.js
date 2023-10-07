import { readdir, readFile, writeFile } from 'fs/promises';
import { join, extname } from 'path';
import CryptoJS from 'crypto-js';

export async function importDirectory(directoryPath)
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

export async function checkUpdateHash(hashFilePath, expectedHash)
{
	const containedHash = await readFile(hashFilePath, 'utf-8');

	if (expectedHash === containedHash)
		return true;
	else
		await writeFile(hashFilePath, expectedHash, { encoding: 'utf-8', flag: 'w' });

	return false;
}

export function hashModules(importedModules)
{
	let hashes = [];
	for (const importedModule of importedModules)
	{
		for (const importedName in importedModule)
		{
			const importedProperty = importedModule[importedName];
			let stringfiedProperty = null;

			if (typeof importedProperty === 'object')
				stringfiedProperty = JSON.stringify(importedProperty);
			else
				stringfiedProperty = importedProperty.toString();

			hashes.push(CryptoJS.MD5(stringfiedProperty).toString());
		}
	}

	const concatHash = hashes.sort().join('');
	return CryptoJS.MD5(concatHash).toString();
}
