//mapboxgl.accessToken = ''; //<your access token here>
mapboxgl.accessToken = 'pk.eyJ1IjoidmVldiIsImEiOiIzdzVEVDdrIn0.z3N2X1Fk7rx4wXesVf0-rQ';

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

		map.on('click', 'nyc-city-council', function(e) {
			
			var popup = new mapboxgl.Popup()
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

	});

});