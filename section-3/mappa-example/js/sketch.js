// Your Mapboxgl API Key
let key = ''; // <your access token here>;

// Create a new Mappa instance using Mapboxgl.
let mappa = new Mappa('Mapboxgl', key);
let myMap;
let canvas;

// Map options
let options = {
  lat: 40.782,
  lng: -73.967,
  zoom: 4,
  style: 'mapbox://styles/mapbox/dark-v9'
}

function setup(){
  canvas = createCanvas(800, 700);
  console.log('creating canvas');
  // Create a tile map centered in New York with an initial zoom level of 4.
  myMap = mappa.tileMap(options);
  // Overlay the tile map to the p5 canvas. This will display the map.
  myMap.overlay(canvas);
}

function draw(){
  // Clear the background so the map is clearly seen at each frame.
  clear();
  fill(255, 255, 255);
  ellipse(mouseX, mouseY, 40, 40);
}