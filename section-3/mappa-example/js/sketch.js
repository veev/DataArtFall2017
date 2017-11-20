// Your Mapboxgl API Key
let key = ''; // <your access token here>;

// Create a new Mappa instance using Mapboxgl.
let mappa = new Mappa('Mapboxgl', key);
let myMap;
let canvas;

let flyNow = false;

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

  myMap.onChange( function() {
    console.log("Map Changed"); // watch the console for how often this event is triggered
  });
}

function draw(){
  if (flyNow) {
    //console.log(myMap);
    myMap.map.flyTo({
      center: [
          -74.50 + (Math.random() - 0.5) * 10,
          40 + (Math.random() - 0.5) * 10
        ],
      zoom: 9
    });
    flyNow = !flyNow; // try commenting this out and see what happens
  }
}

function keyReleased() {
  flyNow = !flyNow;
}