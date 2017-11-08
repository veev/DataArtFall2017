mapboxgl.accessToken = ''; //<your access token here>
// the code won't run without your own token inserted between the single quotes

var map = new mapboxgl.Map({
    container: 'map',
    style: 'mapbox://styles/mapbox/light-v9',
    center: [ -73.97332, 40.685787 ], // starting position [lng, lat]
    zoom: 12 // starting zoom level
});

// load geojson data once base map has loaded
map.on('load', function() {
	// load data with d3 (just my preference, load it another way if you prefer)
	d3.json('../data/City Council Districts.geojson', function(err, data) {
		if (err) throw err;

		console.log(data);

		// map source (data) needs a name, type and data
		map.addSource('city-council-districts', { type: 'geojson', data: data });

		// map layer needs an id, type, the source and a style
		map.addLayer({
			'id': 'nyc-city-council',
			'type': 'fill',
			'source': 'city-council-districts',
			'paint': {
				'fill-color': '#088',
				'fill-outline-color': '#fff',
				'fill-opacity': 0.4
			}
		});

		// add interactivity to see a popup with info about a district
		map.on('click', 'nyc-city-council', function(e) {
			
			let popup = new mapboxgl.Popup()
				.setLngLat(e.lngLat)
				.setHTML("City Council District " + e.features[0].properties.coun_dist)
				.addTo(map);
		});

		map.on('mouseenter', 'nyc-city-council', function() {
			// Change the cursor style as a UI indicator.
        	map.getCanvas().style.cursor = 'pointer';
		})

		map.on('mouseleave', 'nyc-city-council', function() {
			// Change the cursor style back as a UI indicator.
			map.getCanvas().style.cursor = '';
		});

		// add mapbox geocoder to look up an address!
		let geocoder = new MapboxGeocoder({ 
			accessToken: mapboxgl.accessToken
		});
		map.addControl(geocoder);

		// create an empty array to keep track of popups
		let popups = [];

		// listen to 'result' event to see which address and coordinate is searched
		geocoder.on('result', function(res) {

			// if there's already a city council popup, erase it!
			if (popups.length > 0) {
				console.log(popups);

				//remove all the popups from the map if they already exist
				popups.forEach(function(popup) {
					popup.remove();
				});
			}
			console.log(res.result);

			// put lat / lon into a turf point (just for a shorter variable name)
			let pt = turf.point(res.result.geometry.coordinates);
			// console.log(pt);

			//iterate through multipolygons to see which one point is inside
			data.features.forEach( function(feature) {
				// turf.inside is a method to check whether a point is inside a polygon
				if (turf.inside(pt, feature)) {

					let councilInfo = new mapboxgl.Popup()
						.setLngLat(pt.geometry.coordinates)
						.setHTML("You're in city council district " + feature.properties.coun_dist)
						.addTo(map);
					popups.push(councilInfo);
				}
			})
		});
	});

});