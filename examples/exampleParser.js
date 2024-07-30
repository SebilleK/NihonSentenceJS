// example usage of nlcst-parse-japanese
// run node examples/exampleParser.js
import { JapaneseParser } from 'nlcst-parse-japanese';

const text = 'もう何も 教えることはない';

const japaneseParser = new JapaneseParser();

//! you nead to use the ready method!
japaneseParser.ready().then(() => {
	let result = japaneseParser.parse(text);

	// printing all resulting child nodes
	/* result.children.forEach(function (child) {
		console.log(JSON.stringify(child, null, 2));
	}); */

	function printWords(node) {
		if (node.type === 'WordNode') {
			node.children.forEach(child => {
				if (child.type === 'TextNode') {
					console.log(`Value: ${child.value} | Reading: ${child.data.reading} \n\n`);
				}
			});
		}

		if (node.children) {
			node.children.forEach(child => printWords(child));
		}
	}

	printWords(result);
});
