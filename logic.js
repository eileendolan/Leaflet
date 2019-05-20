// Store our API endpoint inside queryUrl
var queryUrl = "http://earthquake.usgs.gov/earthquakes/feed/v1.0/geojson.php"

// Perform a GET request to the query URL
d3.json(queryUrl, function(data) {
  // Once we get a response, send the data.features object to the createFeatures function
  createFeatures(data.features);
  console.log(data.features)
});

function createFeatures(earthquakeData) {

  // Define a function we want to run once for each feature in the features array
  // Give each feature a popup describing the place and time of the earthquake
  function onEachFeature(feature, layer) {
    layer.bindPopup("<h3>" + feature.properties.place +
      "</h3><hr><p>" + new Date(feature.properties.time) + "</p>");
  }

  // Radius size based on magnitude
  function radiusSize(magnitude) {
    return magnitude * 3;
  }

  // Color of circles based on magnitude 
  function circleColor(magnitude) {
    if (magnitude < 1) {
      return "#33FF93"
    }
    else if (magnitude < 2) {
      return "#ABFF33"
    }
    else if (magnitude < 3) {
      return "E9FF33"
    }
    else if (magnitude < 4) {
      return "#EEA30F"
    }
    else if (magnitude < 5) {
      return "#FF3D33"
    }
    else {
      return "#FF33B9"
    }
  }

  // Create a GeoJSON layer containing the features array on the earthquakeData object
  // Run the onEachFeature function once for each piece of data in the array
  var earthquakes = L.geoJSON(earthquakeData, {
    pointToLayer: function(earthquakeData, latlng) {
      return L.circle(latlng, {
        radius: radiusSize(earthquakeData.properties.mag),
        color: circleColor(earthquakeData.properties.mag),
        fillOpacity: 1
      });
    },
    onEachFeature: onEachFeature
  });

  // Sending our earthquakes layer to the createMap function
  createMap(earthquakes);
}

function createMap(earthquakes) {
 
// define a function to create the map
function createMap() {
    // define street, outdoor, satellite maps
    var satellite = L.tileLayer("https://api.mapbox.com/styles/v1/cherngywh/cjfkdlw8x057v2smizo9hqksx/tiles/256/{z}/{x}/{y}?" +
        "access_token=pk.eyJ1IjoiY2hlcm5neXdoIiwiYSI6ImNqZXZvcGhhYTcxdm4ycm83bjY1bnV3amgifQ.MOA-PIHTOV90Ql8_Tg2bvQ");

    var dark = L.tileLayer("https://api.mapbox.com/styles/v1/cherngywh/cjfon2bd904iy2spdjzs1infc/tiles/256/{z}/{x}/{y}?" +
    "access_token=pk.eyJ1IjoiY2hlcm5neXdoIiwiYSI6ImNqZXZvcGhhYTcxdm4ycm83bjY1bnV3amgifQ.MOA-PIHTOV90Ql8_Tg2bvQ");

    var street = L.tileLayer("https://api.mapbox.com/styles/v1/cherngywh/cjfokxy6v0s782rpc1bvu8tlz/tiles/256/{z}/{x}/{y}?" +
        "access_token=pk.eyJ1IjoiY2hlcm5neXdoIiwiYSI6ImNqZXZvcGhhYTcxdm4ycm83bjY1bnV3amgifQ.MOA-PIHTOV90Ql8_Tg2bvQ");

    // define a baselayer object to hold our base layer objects
    var baseLayers = {
        "Street": street,     
        "Dark": dark,
        "Satellite": satellite
    };

  // Create overlay object to hold our overlay layer
  var overlayMaps = {
    Earthquakes: earthquakes
  };

  // Create our map, giving it the streetmap and earthquakes layers to display on load
  var myMap = L.map("map", {
    center: [
      37.09, -95.71
    ],
    zoom: 5,
    layers: [street, earthquakes]
  });

  // Create a layer control
  // Pass in our baseMaps and overlayMaps
  // Add the layer control to the map
  L.control.layers(baseMaps, overlayMaps, {
    collapsed: false
  }).addTo(myMap);

  // color function to be used when creating the legend
  function getColor(d) {
    return d > 5 ? '#FF3D33' :
           d > 4  ? '#EEA30F' :
           d > 3  ? '#E9FF33' :
           d > 2  ? 'ABFF33' :
           d > 1  ? '#33FF93' :
                    '#FF33B9';
  }

  // Add legend to the map
  var legend = L.control({position: 'bottomright'});
  
  legend.onAdd = function (map) {
  
      var div = L.DomUtil.create('div', 'info legend'),
          mags = [0, 1, 2, 3, 4, 5],
          labels = [];
  
      // loop through our density intervals and generate a label with a colored square for each interval
      for (var i = 0; i < mags.length; i++) {
          div.innerHTML +=
              '<i style="background:' + getColor(mags[i] + 1) + '"></i> ' +
              mags[i] + (mags[i + 1] ? '&ndash;' + mags[i + 1] + '<br>' : '+');
      }
  
      return div;
  };
  
  legend.addTo(myMap);
}

