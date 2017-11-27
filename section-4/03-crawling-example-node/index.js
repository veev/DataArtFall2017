// from netinstructions tutorial

const request = require('request');
const cheerio = require('cheerio');
const URL = require('url-parse');
const fs = require('fs');

const START_URL = "https://www.poets.org/poetsorg/poems?field_poem_themes_tid=866";
const SEARCH_WORD = "America";
const MAX_PAGES_TO_VISIT = 10;

// Create a Hashmap to keep track of pages we've visited
const pagesVisited = {};
// Create a variable to store the index or number of pages visited
let numPagesVisited = 0;
// Create an array to store the page urls
const pagesToVisit = [];
// Format url
const url = new URL(START_URL);
const baseUrl = url.protocol + "//" + url.hostname; //https: + // + www.poets.org

// push the first URL into the pages array
pagesToVisit.push(START_URL);

//Create an array to store scraped poems
let poems = [];

// call the main crawl function
crawl();

// define the main crawl function
// crawl pages until you've reached the max number to visit
function crawl() {
	if (numPagesVisited >= MAX_PAGES_TO_VISIT) {
		console.log("Reached max limit of number of pages to visit.");
		// write out poems to file
		fs.writeFileSync('poems.json', JSON.stringify(poems, null, 4), 'utf-8');
		return;
	}
	// get element from the end of pagesToVisit array to go to next
	let nextPage = pagesToVisit.pop();
	if (nextPage in pagesVisited) {
		// We've already visited this page, so repeat the crawl
		crawl();
	} else {
		// It's a new page we haven't visited, so visitPage
		// use a timeout delay so as not to overwhelm the web page
		setTimeout( function() {
			visitPage(nextPage, crawl);
		}, 600);
	}
}

function visitPage(url, callback) {
	// Add page to our Hashmap
	pagesVisited[url] = true;
	// Increment number of pages visited
	numPagesVisited++;

	// Make the request
	console.log("Visiting page " + url);
	// Use Method from the request library
	request(url, (error, response, body) => {
		// return whether the website errors
		if (error) console.log("Error", error);
		// Check status code (200 is HTTP OK)
		console.log("Status code: " + response.statusCode);

		if (response.statusCode === 200) {
			// Parse the document body
			// Create variable $ to hold body HTML
			const $ = cheerio.load(body);

			// Call function to parse body HTML on main page 
			// for relative links to poem pages
			collectPoemLinks($);
			//console.log(pagesToVisit);

			// get the author metadata
			// if the url visited is a poem url, collect  other information
			if (url.indexOf('https://www.poets.org/poetsorg/poem/') != -1) {
				let poem = {};
				console.log("On Poem Page", url);

				let title = $('#poem-content').find('h1').text();
				let author = $('#poem-content').find('.node-title').text();
				let authorDOB = $('#poem-content').find('.date-display-single').text();
				let wholeText = $('#poem-content .field-items').find('div, div p');
				let cleanPoem = '';
				const carriageReturn = $('<text>\n</text>').contents();
				// we want to preserve line breaks so let's add them to the poem string
				wholeText.each( function(i, element) {
					// you need to wrap the element in cheerio again to call the text function
					//console.log($(element).text());
					cleanPoem += $(element).text() + "\n";
				});
				let copyright = $('.poem-credit .field-items p').first().text();

				poem.title = title;
				poem.author = author;
				poem.authorDOB = authorDOB;
				poem.text = cleanPoem;
				poem.copyright = copyright;

				poems.push(poem);
			}

			// In this short program, our callback is just calling crawl()
			callback();
		}
	});
}

function collectPoemLinks($) {
	// find links in tbody element - poems
	// cheerio uses JQuery syntax to isolate DOM elements
	const relativeLinks = $("tbody tr td.views-field-title a[href^='/']"); 
	console.log("Found " + relativeLinks.length + " relative links");
	// console.log(relativeLinks);
	relativeLinks.each( function() {
		// add them to the pagesToVisit array
		pagesToVisit.push(baseUrl + $(this).attr('href'));
	});
}