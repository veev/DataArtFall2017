mapboxgl.accessToken = ''; //<your access token here>; must register a mapbox access token to try example

// Date parsing and formatting with d3: https://github.com/d3/d3-time-format
// symbols must match string that represents date -> parsing converts it into date object
// "2017-03-02T00:00:00.000"
let dateParser = d3.timeParse("%Y-%m-%dT%H:%M:%S.%L"); 
let dateFormatter = d3.timeFormat("%a %b %e %Y");

const map = new mapboxgl.Map({
    container: 'map',
    style: 'mapbox://styles/mapbox/satellite-v9',
    center:  [-73.97332, 40.685787],
    zoom: 11
});

map.on('load', function () {
    // We use D3 to fetch the JSON here so that we can parse and use it separately
    // from GL JS's use in the added source. You can use any request method (library
    // or otherwise) that you want.
    // url is returning static JSON from nyc open data portal
    d3.json('https://data.cityofnewyork.us/resource/3ktt-gd74.json', function(err, data) {
        if (err) throw err;
        console.log(data);

        let linkLocations = {};
        linkLocations.type = "FeatureCollection";
        linkLocations.features = [];

        // Go through array of data
        data.forEach( d => {
            // Create a feature
            let feature = {};
            feature.geometry = d.location;
            // console.log(feature);
            feature.properties = {};
            feature.properties.installDate = d.link_installation;
            feature.properties.installTimestamp = Date.parse(d.link_installation);
            feature.properties.street_address = d.street_address;
            feature.properties.borough = d.boro;
            feature.properties.neighborhood = d.neighborhood_tabulation_area_nta;
            //create description string to more easily add multi-string popup to the circles
            feature.properties.description = "installed " + dateFormatter(dateParser(d.link_installation)) + " at " + d.street_address + ", " + d.boro;
            // add more properties as needed
            linkLocations.features.push(feature);

        });

        console.log(linkLocations);

        // add it to the map
        map.addSource('links', { type: 'geojson', data: linkLocations });
        map.addLayer({
            "id": "linkLocations",
            "type": "circle",
            "source": "links",
            "paint": {
                "circle-opacity": 0.75,
                "circle-radius": 5,
                "circle-color": "cyan"
            }
        });

        // Create a popup, but don't add it to the map yet.
        let popup = new mapboxgl.Popup({
            closeButton: false,
            closeOnClick: false
        });

        map.on('mouseenter', 'linkLocations', function(e) {
            // Change the cursor style as a UI indicator.
            map.getCanvas().style.cursor = 'pointer';

            // Populate the popup and set its coordinates
            // based on the feature found.
            popup.setLngLat(e.features[0].geometry.coordinates)
                .setHTML(e.features[0].properties.description)
                .addTo(map);
        });

        map.on('mouseleave', 'linkLocations', function() {
            map.getCanvas().style.cursor = '';
            popup.remove();
        });
    });
});