mapboxgl.accessToken = ''; //<your access token here>

var map = new mapboxgl.Map({
    container: 'map',
    style: 'mapbox://styles/mapbox/satellite-v9',
    center: [ -122.26242, 37.887569 ], // starting position [lng, lat]
    zoom: 9 // starting zoom
});

map.on('load', function () {

    // We use D3 to fetch the JSON here so that we can parse and use it separately
    // from GL JS's use in the added source. You can use any request method (library
    // or otherwise) that you want.
    d3.json('../data/moves/places_20170715-lines.geojson', function(err, data) {
        if (err) throw err;

        console.log(data);

        // save full coordinate list for later
        var coordinates = data.features[0].geometry.coordinates;
        console.log(coordinates);

        // start by showing just the first coordinate
        data.features[0].geometry.coordinates = [coordinates[0]];

        // // add it to the map
        map.addSource('trace', { type: 'geojson', data: data });
        map.addLayer({
            "id": "trace",
            "type": "line",
            "source": "trace",
            "paint": {
                "line-color": "yellow",
                "line-opacity": 0.75,
                "line-width": 5
            }
        });

        // setup the viewport
        map.jumpTo({ 'center': coordinates[0], 'zoom': 14 });
        map.setPitch(30);

        // on a regular basis, add more coordinates from the saved list and update the map
        var i = 0;
        var timer = window.setInterval(function() {
            if (i < coordinates.length) {
                console.log(coordinates[i]);
                data.features[0].geometry.coordinates.push(coordinates[i]);
                map.getSource('trace').setData(data);
                map.panTo(coordinates[i]);
                i++;
            } else {
                window.clearInterval(timer);
            }
        }, 500);
    });
});