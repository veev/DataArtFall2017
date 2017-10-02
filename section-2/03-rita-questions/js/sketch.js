let questions = [];

function setup() {
	createCanvas(1200, 800);
	console.log("in setup");
	// once strings load from data, call the callback function parseText()
	loadStrings("../data/timemachine.txt", loadText);
}

function loadText(lines) {
	// join each line based on the carriage return symbol '\n'
	let allText = lines.join(' ');

	// clean out the header and footer gutenberg info
	// use *** as a delimeter to isolate book portion between them
	let splitText = allText.split('***');
	//console.log(splitText);

	// when you print out the splitText array, the element at index 2 is the book portion
	let isolatedBook = splitText[2];
	//console.log(isolatedBook);

	// use RiTa to get our sentence array
	let sentences = RiTa.splitSentences(isolatedBook);
	console.log(sentences);

	for (let i = 0; i < sentences.length; i++) {
		// create a RiTa string from each sentence string
		let rs = new RiString(sentences[i]);

		// console.log RiString.features() to see features
		// console.log(rs.features());

		// get all the questions from the Book
		if (RiTa.isQuestion(sentences[i])) {
			questions.push(rs);
		}
	}

	// iterate through all the questions and get their syllable count
	questions.forEach( function(question) {

		// since question is a RiString, we can get its features
		let syllables = question.get("syllables");
		console.log(syllables);

		// What's the count of syllables based on the spaces and forward slashes?
		// Use regex to split on either spaces OR forward slashes
		let syllablesCount = syllables.split(/[ /]+/);
		console.log(syllablesCount);
		// subtract 1 from each count to account for the space before punctuation
		question.syllableCount = syllablesCount.length - 1; 

	});
	console.log(questions);

	// use lodash to sort array of objects based on syllableCount property added to the object
	// function takes array of objects to sort, then property to sort by
	let sorted = _.orderBy(questions, ['syllableCount']);
	console.log(sorted);

	sorted.forEach(function(question, index) {
		//console.log(question.features().text);
		text(question.features().text, question.x, 10 + index * 20);
	});
}