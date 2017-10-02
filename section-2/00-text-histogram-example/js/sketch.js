
function setup() {
	createCanvas(1200, 2000);
	console.log("in setup");
	// once strings load from data, call the callback function parseText()
	loadStrings("../data/timemachine.txt", loadText);
}

function loadText(lines) {
	console.log("loaded");
	
	// print out the array of strings (each line of text is an element in the array)
	//console.log(lines);

	// join each line based on the carriage return symbol '\n'
	let allText = lines.join(' ');

	// print out to see the difference
	//console.log(allText);

	// clean out the header and footer gutenberg info
	// use *** as a delimeter to isolate book portion between them
	let splitText = allText.split('***');
	//console.log(splitText);

	// when you print out the splitText array, the element at index 2 is the book portion
	let isolatedBook = splitText[2];

	// while we're here, let's save the isolated book results out as a text file
	console.log(isolatedBook);

	// need to make sentence array to saveStrings
	let splitStrings = isolatedBook.split('\n');

	// save out isolated text as new text file
	//saveStrings(splitStrings, "timemachine_only.txt");

	analyzeBook(isolatedBook);

}

function analyzeBook(book) {
	console.log("analyzeBook");
	// how many sentences is it?

	// use regex to split by sentence ending punctuation (and retain punctuation)
	// +/g is the negative look ahead to split on word boundaries
	// honestly I get most of the regex I use from stack overflow
	let results = book.match( /[^\.!\?]+[\.!\?]+/g );
	//console.log(results);
	console.log("The book is " + results.length + " sentences long");

	// what if we want to compare the lengths of the sentences?
	let sentenceLengths = [];
	
	// iterate through the sentences
	results.forEach( function(sentence) {
		//console.log(sentence);
		// replace ↵ characters (new line) with spaces
		let clean = sentence.replace(/\n/ig, ' ');
		//console.log(clean);
		
		// get length of string
		let numChars = clean.length;
		sentenceLengths.push(numChars);

		// for the last result, analyze the whole array
		if (sentenceLengths.length === results.length) {
			console.log(sentenceLengths);
			console.log("Longest Sentence is: " + max(sentenceLengths) + " characters long");
			console.log("Shortest Sentence is: " + min(sentenceLengths) + " characters long");

			// let's plot the lengths of the sentences as a histogram
			let skipFactor = 0;
			sentenceLengths.forEach( function(sentenceL) {
				let y = 0;
				let x = 0;
				let w = map(sentenceL, min(sentenceLengths), max(sentenceLengths), 2, width - 10);
				rect(x, y + skipFactor, w, 1);
				skipFactor++;
			});
		}
	});
}

function draw() {

}