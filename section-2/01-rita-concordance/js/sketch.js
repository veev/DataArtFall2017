// from Allison Parish's tutorial
// http://creative-coding.decontextualize.com/intro-to-ritajs/

let counts = {};
let lines = [];

function preload() {
  lines = loadStrings("../data/timemachine_only.txt");
}

function setup() {
	createCanvas(800, 600);
	console.log(lines.join(' '));

	var args = {
		ignoreCase: false,
		ignoreStopWords: true
	};

	counts = RiTa.concordance(lines.join(" "), args);
	console.log(counts);
	total = totalValues(counts);

	background(50);
	textAlign(CENTER, CENTER);
	textSize(24);
	noStroke();
	fill(255);
	noLoop();
}

function draw() {
	for (let k in counts) {
		if (counts.hasOwnProperty(k)) {
			if (counts[k]/total > 0.001) {
				console.log(counts[k]);
				let fillColor = map(counts[k], 0, 183, 0, 255);
				fill(fillColor);
				textSize((counts[k]/total) * 10000);
				//TODO: place words better
				text(k, random(width), random(height));
			}
		}
	}
}

function totalValues(obj) {

	// handy algorithm to total all the numeric values in concordance object
	var total = 0;
	for (var k in obj) {
		if (obj.hasOwnProperty(k)) {
			total += obj[k];
		}
	}
	return total;
}