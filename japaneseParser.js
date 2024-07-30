import { JapaneseParser } from 'nlcst-parse-japanese';
export async function japaneseParser(text) {
	const japaneseParser = new JapaneseParser();

	await japaneseParser.ready();

	const result = japaneseParser.parse(text);

	function extractWords(node) {
		let output = '';

		if (node.type === 'WordNode') {
			node.children.forEach(child => {
				if (child.type === 'TextNode') {
					output += `Value: ${child.value} | Reading: ${child.data.reading}\n\n`;
				}
			});
		}

		if (node.children) {
			node.children.forEach(child => {
				output += extractWords(child);
			});
		}

		return output;
	}

	return extractWords(result);
}
