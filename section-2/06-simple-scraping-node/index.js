let request = require('request');
let cheerio = require('cheerio');
let fs = require('fs');

let url = "https://www.reddit.com";

request(url, function(error, response, body) {
	if(error) {
		console.log("Error: " + error);
	}
	console.log("Status code: " + response.statusCode);

	let $ = cheerio.load(body);

	// this is jquery-like syntax to traverse DOM elements
	// inspect page with Chrome Dev Tools to understand structure
	$('div#siteTable > div.link').each(function( index ) {
		var title = $(this).find('p.title > a.title').text().trim();
		var score = $(this).find('div.score.unvoted').text().trim();
		var user = $(this).find('a.author').text().trim();
		console.log("Title: " + title);
		console.log("Score: " + score);
		console.log("User: " + user);
		fs.appendFileSync('reddit.txt', title + '\n' + score + '\n' + user + '\n');
	});
});