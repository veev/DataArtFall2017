let populations = [];

function preload() {
	// Don't use preload() function for JSON files, 
	// currently a bug in p5 where it doesn't return JSON Arrays only JSON Objects
}

function callback(data) {
	console.log('done loading data');
	console.log(data);
	populations = data;
}

function setup() {
	createCanvas(1200, 800);
	// load static data set here
	loadJSON('../../data/simpleData_noRegions.json', callback);
}

function draw() {
	background(255);
	//if the data is loaded, start working with it
	if (populations) {
		for (let i = 0; i < populations.length; i++) {
			//console.log(populations[i]);
		
			let name = populations[i].country;
			let population = populations[i].estimate;
			//sampling error of the estimate, estimate could be + or - the margin of error
			let error = populations[i].marginOfError;
			
			//get magnitude of error compared to population estimate;
			let errorFraction =  populations[i].marginOfError / population;
			//console.log(errorFraction);
			
			//map population estimate to "x axis"
			//population estimate ranges from 500 to 3M
			let x = map(population, 500, 3000000, 0, width);

			//map errorFraction to "y axis"
			let y = map(errorFraction, 0, 0.2, 0, height);

			// square root or cube root is useful to compare sizes of different magnitudes of order
			let size = map(sqrt(population), sqrt(500), sqrt(3000000), 5, 200);
			let colour = map(population, 500, 3000000, 0, 255);

			//population size affects the green channel - more yellow the higher the population
			fill(255, colour, 0, 100);
			noStroke();
			ellipse(x, y, size, size);

			fill(0);
			textSize(11);
			textAlign(CENTER);
			text(name, x, y);
		}
	}
}