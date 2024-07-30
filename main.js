import fs from 'fs';
import path from 'path';
import { japaneseParser } from './japaneseParser.js';

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
async function processFolder(inputFolder, outputFolder) {
	if (!fs.existsSync(outputFolder)) {
		fs.mkdirSync(outputFolder);
	}

	const files = fs.readdirSync(inputFolder);

	for (const fileName of files) {
		const inputFilePath = path.join(inputFolder, fileName);
		if (fs.lstatSync(inputFilePath).isFile()) {
			let fileContent = readFile(inputFilePath);
			fileContent = cleanExtraSpace(fileContent);

			// cleaning the text for characters only
			const japaneseCharacters = extractJapaneseCharacters(fileContent);
			const japaneseText = japaneseCharacters.join('');

			// output -> cleaned text
			const cleanOutputFilePath = path.join(outputFolder, `clean_${fileName}`);
			fs.writeFileSync(cleanOutputFilePath, japaneseText, 'utf8');

			try {
				// parsing the text | output -> formatted text for words + readings
				const formattedText = await japaneseParser(japaneseText);
				const outputFilePath = path.join(outputFolder, `parsed_${fileName}`);
				fs.writeFileSync(outputFilePath, formattedText, 'utf8');
			} catch (error) {
				console.error(`Error formatting text for file ${fileName}:`, error);
			}
		}
	}
}

//! driver code
const inputFolder = 'input'; //? replace with input folder name if needed
const outputFolder = 'output';

processFolder(inputFolder, outputFolder);
