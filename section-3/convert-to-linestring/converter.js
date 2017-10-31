// in your terminal install geojson-tools
let geojson = require('geojson-tools');
let fs = require('fs');
let filepath = '../data/moves/places_20170715';

let data = JSON.parse(fs.readFileSync(filepath + '.geojson', 'utf8'));
// console.log(data);

// Create an empty list to store all coordinates in geojson
let coordinatesList = [];

data.features.forEach( feature => {
	let tempCoord = feature.geometry.coordinates;
	coordinatesList.push(tempCoord);
});

// Create our own Line String Feature Collection from coordinates list
let geoJsonLineString = {};

// Set the type to Feature Collection
geoJsonLineString.type = "FeatureCollection";
geoJsonLineString.features = []; // create empty features array

// Create the Features - It's a LineString so there will only be one feature, but it will have an array of coordinates
let lineStringFeature = {};
lineStringFeature.type = "Feature";
// Create the geometry object
lineStringFeature.geometry = {};
lineStringFeature.geometry.type = "LineString";
// Set the Line String coordinates to our saved coordinates list
lineStringFeature.geometry.coordinates = coordinatesList;

// Set the Line String Feature to be the features of the Feature Collection
geoJsonLineString.features.push(lineStringFeature);

console.log(geoJsonLineString);

//fs.writeFileSync('./out/' + complaintString + '_dateFormatted.json', JSON.stringify(result, null, 4), 'utf-8');
fs.writeFileSync(filepath + '-lines.geojson', JSON.stringify(geoJsonLineString, null, 4), 'utf-8');