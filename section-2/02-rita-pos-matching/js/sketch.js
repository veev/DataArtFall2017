
function setup() {
	createCanvas(1200, 800);
	console.log("in setup");
	// once strings load from data, call the callback function parseText()
	loadStrings("../data/timemachine.txt", loadText);
}

function loadText(lines) {
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
	//console.log(isolatedBook);

	// use RiTa to get our sentence array
	let sentences = RiTa.splitSentences(isolatedBook);

	let timeTravelerMatches = searchByPOS(sentences, "The Time Traveler was");

	console.log(timeTravelerMatches);
}

function searchByPOS(array, posPattern) {
	//Take the pattern sentence and find its POS
	let pos = RiTa.getPosTags(posPattern);
	console.log(pos);

	// Join the pos array tokens into a pattern string
	let posString = join(pos, " ");
	console.log(posString);

	//console.log(array);

	// Go through our sentences and look for that pattern
	// Put lines with pattern into a new array
	let matches = [];
	array.forEach( function(line, index) {
		console.log(index);

		// find POS tokens of sentence
		let poses = RiTa.getPosTags(line);
		// console.log(poses);

		// join POS tags into a string
		let posesString = join(poses, " ");
		//console.log(posesString);

		// check to see if test POS string is part of sentence POS string
		if (posesString.indexOf(posString) != -1) {
			// console.log("MATCH!: " + line);
			// add that line to new array
			matches.push(line);
		}
	});
	// return matches for POS pattern
	return matches;
}