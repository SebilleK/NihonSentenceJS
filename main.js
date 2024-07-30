const fs = require('fs');
const path = require('path');

// read a text file
function readFile(filePath) {
	return fs.readFileSync(filePath, 'utf8');
}

// extract Japanese scripts (Hiragana, Katakana, Kanji)
function extractJapaneseCharacters(s) {
	const hiraganaPattern = /[\u3040-\u309F]/g;
	const katakanaPattern = /[\u30A0-\u30FF]/g;
	const kanjiPattern = /[\u4E00-\u9FBF]/g;
	const whitespacePattern = /\s+/g;

	const combinedPattern = new RegExp(`${hiraganaPattern.source}|${katakanaPattern.source}|${kanjiPattern.source}|${whitespacePattern.source}`, 'g');

	const matches = s.match(combinedPattern);
	return matches ? matches : [];
}

// replace sequences of 3 or more newlines with 2 newlines
function cleanExtraSpace(text) {
	return text.replace(/(\n\s*){3,}/g, '\n\n');
}

// process all files in specified folder
function processFolder(inputFolder, outputFolder) {
	if (!fs.existsSync(outputFolder)) {
		fs.mkdirSync(outputFolder);
	}

	fs.readdirSync(inputFolder).forEach(fileName => {
		const inputFilePath = path.join(inputFolder, fileName);
		if (fs.lstatSync(inputFilePath).isFile()) {
			let s = readFile(inputFilePath);
			s = cleanExtraSpace(s);
			const japaneseCharacters = extractJapaneseCharacters(s);
			const outputFilePath = path.join(outputFolder, fileName);
			fs.writeFileSync(outputFilePath, japaneseCharacters.join(''), 'utf8');
		}
	});
}

//! driver code
const inputFolder = 'input'; //? replace with input folder name if needed
const outputFolder = 'output';

processFolder(inputFolder, outputFolder);
