
let data = "suburb-2-vic.geojson";
// let url = "suburb-2-nsw.geojson";


d3.json(data).then(function (data) {
  console.log(data);
  createFeatures(data.features);
});



function createFeatures(suburbdata) {

  // Define a function that we want to run once for each feature in the features array.
  // Give each feature a popup that describes the place and time of the earthquake.
  function onEachFeature(feature, layer) {
    layer.bindPopup(`<h3>Suburb is ${feature.properties.vic_loca_2}</h3>`);
  }
 
  // Create a GeoJSON layer that contains the features array 
  // Run the onEachFeature function once for each piece of data in the array.
  let style = {weight: 0.5,
  opacity: 50,
  color: 'red',
  fillOpacity: 0.2};

  let suburbs = L.geoJSON(suburbdata, {
    style: style,
    onEachFeature: onEachFeature
  });

  // Send our suburb layer to the createMap function/
  createMap(suburbs);
}

function createMap(suburbs) {

  // Create the base layers.
  // let street = L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
  //   attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
  // })

  // let topo = L.tileLayer('https://{s}.tile.opentopomap.org/{z}/{x}/{y}.png', {
  //   attribution: 'Map data: &copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors, <a href="http://viewfinderpanoramas.org">SRTM</a> | Map style: &copy; <a href="https://opentopomap.org">OpenTopoMap</a> (<a href="https://creativecommons.org/licenses/by-sa/3.0/">CC-BY-SA</a>)'
  // });

  let googleSat = L.tileLayer('http://{s}.google.com/vt/lyrs=s&x={x}&y={y}&z={z}',{
    maxZoom: 20,
    subdomains:['mt0','mt1','mt2','mt3']
    });

    googleStreets = L.tileLayer('http://{s}.google.com/vt/lyrs=m&x={x}&y={y}&z={z}',{
      maxZoom: 20,
      subdomains:['mt0','mt1','mt2','mt3']
     });

  // Create a baseMaps object.
  let baseMaps = {
    // "Street Map": street,
    // "Topographic Map": topo,
    "Sattelite": googleSat,
    "Streets": googleStreets
  };

  // Create an overlay object to hold our overlay.
  let overlayMaps = {
    Suburbs: suburbs
  };

  // Create our map, giving it the streetmap and earthquakes layers to display on load.
  let myMap = L.map("map", {
    center: [
      -37.16921, 145.00606
    ],
    zoom: 7,
    layers: [googleSat, suburbs]
  });

  // Create a layer control.
  // Pass it our baseMaps and overlayMaps.
  // Add the layer control to the map.
  L.control.layers(baseMaps, overlayMaps, {
    collapsed: false
  }).addTo(myMap);

}
