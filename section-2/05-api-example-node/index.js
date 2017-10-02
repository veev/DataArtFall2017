const request  = require('request');
const fs = require('fs');

// var results = {
// 	'how do i': [
// 		'how do i live',
// 		...
// 	],
// 	'what is': [
// 		...
// 	]
// }

let results = {};

let query = ['how do i', 'what is', 'anyone', 'i am', 'who are', 'i think'];
let service = 'yt';
let language = 'en';

function concatenateUrl(query, service, language) {
	let requestUrl = 'https://www.google.com/complete/search?&client=firefox' +
					 '&q=' + query +
					 '&ds=' + service +
					 '&hl=' + language;
	return requestUrl;
}

function callAPI(i) {
	console.log('Called callAPI');
	console.log(query[i] + ', ' + service + ', ' + language);
	let url = concatenateUrl(query[i], service, language);

	// This is the actual API call
	request(url, function(error, response, body){
		// console.log(response);
		console.log(body);
		// This is all NATIVE javascript
		console.log(typeof body);		// My original data is just a string
		let result = JSON.parse(body);	// I need to convert it to a JSON object
		console.log(typeof result);
		let autocomplete = result[1];	// Getting just the autocomplete suggestions
		console.log(autocomplete);

		results[query[i]] = autocomplete;
		console.log(results);

		i++;
		if (i < query.length) {
			callAPI(i);
		} else {
			fs.writeFileSync('out/autocomplete_results.json', JSON.stringify(results, null, 4), 'utf-8');
		}
	});
}

// call the function the first time
callAPI(0);