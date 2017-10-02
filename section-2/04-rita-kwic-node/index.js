// Helps us read files and directory structures
let fs = require('fs');

// Helps create path urls
var path = require('path');

// NLP analysis library
let rita = require('rita');

// load data from text file
// console.log(path.resolve(__dirname, '..', 'data', 'timemachine_clean.txt'));
let data = fs.readFileSync(path.resolve(__dirname, '..', 'data', 'timemachine_only.txt'), 'UTF-8');
//console.log(data);

// get concordance to see most popular words in text
let concordance = rita.concordance(data, {
	ignoreCase: false,
	ignoreStopWords: true
});

// console.log(concordance);

// for each word in the concordance object
for (word in concordance) {

	// if the word appears more than 30 times - make a text file of the keyword in context
	if (concordance.hasOwnProperty(word) && concordance[word] > 30) {
		// console.log(word);
		let kwic = rita.kwic(data, word, {
			ignorePunctuation: true,
			ignoreStopWords: true,
			wordCount: 6
		});

		let joined = kwic.join('\n');
		// console.log(joined);

		// console.log(__dirname);
		// save out a new text file with the kwic for that word
		fs.writeFileSync(path.resolve(__dirname, 'out', word + '.txt'), joined);
	} 
}