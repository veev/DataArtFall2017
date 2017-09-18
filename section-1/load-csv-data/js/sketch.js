let populations;

function preload() {
	populations = loadTable("../../data/simpleData.csv", "csv", "header");
}

function setup() {

	console.log(populations.getRowCount() + " total rows in table");
	console.log(populations.getColumnCount() + " total columns in table");

	// how do we want to work with our Table Data?
	console.log(populations.getObject());

	console.log(populations.getArray());

	console.log(populations.getRows());

	// Create an array of objects
	// Declare empty array
	let objArray = [];
	for (let i = 0; i < populations.getRowCount(); i++) {
		// get the object from each CSV row - country, estimate, margin of error
		//console.log(populations.getRow(i));
		let oldObj = populations.getRow(i).obj;

		let newObj = {};
		newObj.country = oldObj.country;
		newObj.estimate = parseInt(oldObj.estimate);
		newObj.error = parseInt(oldObj.marginOfError);
		// put the object into the array
		objArray.push(newObj);
	}

	console.log(objArray);

	// Use slice() to copy objArray so that sorting doesn't modify it
	// sort() function is native JavaScript for manipulating arrays
	let ascendingArray = objArray.slice().sort(compareValues('estimate'));
	console.log(ascendingArray);

	// console.log(objArray.sort(compareValues('estimate')));
	// console.log(objArray.sort(compareValues('estimate', 'descending')));
}

// Handy function to sort an array of objects based on a given key
// From https://www.sitepoint.com/sort-an-array-of-objects-in-javascript/
// sorts in 'ascending' order by default, pass in 'descending' as second argument to sort highest to lowest
function compareValues(key, order='ascending') {
	return function(a, b) {
		if (!a.hasOwnProperty(key) || !b.hasOwnProperty(key)) {
			//property doesn't exist on either object we're comparing
			return 0;
		}
		// turnary operator to format key - similar to if / else statement
		// typeof checks the data type of the property
		// if it's a string, converts it to uppercase so casing is ignored when sorting
		const varA = (typeof a[key] === 'string') ? a[key].toUpperCase() : a[key];
		const varB = (typeof b[key] === 'string') ? b[key].toUpperCase() : b[key];

		// where the sorting magic happens
		// compares each key one by one
		// if comparison is less than 0, a is before b
		// if comparison is greater than 0, b is before a
		let comparison = 0;
		if (varA > varB) {
			comparison = 1;
		} else if (varA < varB) {
			comparison = -1;
		}

		// if you passed in the descending argument, reverse the order and return comparison to the sort function
		return ( (order == 'descending') ? (comparison * -1) : comparison );
	};
}