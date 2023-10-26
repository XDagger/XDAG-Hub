import { copySync, moveSync, removeSync } from 'fs-extra';

const sourcePath = './XDagPortal/.next';
const destinationPath = './.next';

function removeFolder(folderPath: string) {
	removeSync(folderPath);
	console.log('Folder deleted:', folderPath);
}

function moveFolder(source: string, destination: string) {
	removeFolder(destination);
	moveSync(source, destination);
	console.log('Folder moved successfully!');
}

function copyFolder(source: string, destination: string) {
	removeFolder(destination);
	copySync(source, destination);
	console.log('Folder copied successfully!');
}

copyFolder(sourcePath, destinationPath);
