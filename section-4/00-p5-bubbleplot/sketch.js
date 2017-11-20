// Bubblechart for life expectancy and health care spending
// Size circles according to spending? population?
let data;
let countries = [];

function preload() {
	table = loadTable('../data/worldwide-health-lifeexpectancy-cut.csv', 'csv', 'header');
}

function setup() {
	console.log(table);

	const width = 800, // canvas width and height
	height = 500,
	margin = 20,
	w = width - 2 * margin, // chart area width and height
	h = height - 2 * margin;

	createCanvas(width, height);
	background(255);

	let cleanData = [];
	let healthspending = [];
	let lifexpectancies = [];
	let populations = [];

	// for each row in table
	for (let r = 0; r < table.getRowCount(); r++) {
		// fill arrays for each type of data per country
		// table.getNum() is buggy, so use table.getString, then cast to a float
		let tempHealth = table.getString(r, "2014 Health expenditure, total (% of GDP)");
		let tempLifeX = table.getString(r, "2014 Life expectancy at birth, total (years)");
		let tempPop = table.getString(r, "2014 Population, total");

		console.log(tempHealth, tempLifeX, tempPop);
		
		// if any field is empty (NaN) skip data for that row (country)
		if (tempHealth != "" && tempLifeX != "" && tempPop != "") {
			healthspending.push(float(tempHealth));
			lifexpectancies.push(float(tempLifeX));
			populations.push(float(tempPop));
		}
	}
	// Make sure the arrays are all the same length
	// console.log(healthspending.length, lifexpectancies.length, populations.length);

	// console.log("population: ", min(populations), max(populations));
	// console.log("health spending: ", min(healthspending), max(healthspending));
	// console.log("life expectancy: ", min(lifexpectancies), max(lifexpectancies));

	for (let i = 0; i < table.getRowCount(); i++) {
		// make sure to deal with data as numbers, not strings
		let name = table.getString(i, "Country Name");
		let population = float(table.getString(i, "2014 Population, total"));
		let health = float(table.getString(i, "2014 Health expenditure, total (% of GDP)"));
		let lifeX = float(table.getString(i, "2014 Life expectancy at birth, total (years)"));
		console.log(population, health, lifeX);

		if (!isNaN(health) && !isNaN(lifeX) && !isNaN(population)) {
			// map the data to various dimensions - x position, y position and size of ellipse
			// map the sqrt of the population since the domain is so large
			let populationSize = map(sqrt(population), sqrt(min(populations)), sqrt(max(populations)), 10, 80);
			let lifeXPos = map(lifeX, min(lifexpectancies), max(lifexpectancies), margin, width - margin);
			let healthYPos = map(health, min(healthspending), max(healthspending), height - margin, margin);

			// Create a new circle object and store it in the countries array
			let c = new Country(name, lifeXPos, healthYPos, populationSize);
			countries.push(c);
		}
	}
}

function draw() {
	background(255);
	countries.forEach( function(c) {
		c.display();
	});
}

function Country(name, x, y, size) {
	this.name = name;
	this.pos = createVector(x, y);
	this.size = size;

	this.display = function() {
		fill(255, 0, 255, 50);
		noStroke();
		ellipse(this.pos.x, this.pos.y, this.size, this.size);
		if (this.isOverCircle()) {
			this.showName();
		}
	}

	this.showName = function() {
		fill(50);
		text(this.name, this.pos.x, this.pos.y);
	}

	this.isOverCircle = function() {
		let distX = this.pos.x - mouseX;
		let distY = this.pos.y - mouseY;
		if (sqrt(sq(distX) + sq(distY)) < this.size / 2) {
			return true;
		} else {
			return false;
		}
	}
}