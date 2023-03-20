// Use this link to get the GeoJSON data.
let url = "/api/coordinates";
  
// Wrap the json in a promise to return data
d3.json(url).then(function (response) {
  console.log(response);
  let data = response;
console.log(data);

// An array that will store the created postcodeMarkers
let postcodeMarkers = [];

// Define function to get fill color based on the capacity
function fillColor1(capacity) {
  if (capacity > 70000) {return  '#800026'}
  else if (capacity > 55000) {return '#BD0026'}
  else if (capacity > 40000){return '#E31A1C'}
  else if (capacity > 25000) {return '#FC4E2A'}
  else if (capacity > 10000){return '#FD8D3C'} 
  else {return '#FEB24C'}};

for (let i = 0; i < data.length; i++) {
  // loop through the data array, create a new marker, and push it to the cityMarkers array
  postcodeMarkers.push(
    L.circle([data[i].Latitude,data[i].Longitude], {
      fillOpacity: 0.9,
      color: "white",
      fillColor: fillColor1(data[i].Capacity),
      radius: data[i].Installations/5}).bindPopup("<h3>" + "Postcode: " + data[i].postcode + ", " + "Suburb: " + data[i].Suburb + "</h3>" + "<hr>" + "<h4>" + "Current Capacity: " + data[i].Capacity + "</h4>"+ "<hr>" + "<h4>" + "Current Installations: " + data[i].Installations +"</h4>" )
  );
}

// Add all the postcodeMarkers to a new layer group.
// Now, we can handle them as one group instead of referencing each one individually.
let postcodeLayer = L.layerGroup(postcodeMarkers);


// An array that will store the created postcodeMarkers
let potentialMarkers = [];

// Define function to get fill color based on the capacity

for (let i = 0; i < data.length; i++) {
  // loop through the data array, create a new marker, and push it to the cityMarkers array
  potentialMarkers.push(
    L.circle([data[i].Latitude,data[i].Longitude], {
      fillOpacity: 0.2,
      fillColor: "blue",
      radius: data[i].Potential_kilowatts/200}).bindPopup("<h3>" + "Postcode: " + data[i].postcode + "-" + "Suburb: " + data[i].Suburb + "</h3>" + "<hr>" + "<h4>" + "Potential Capacity: " + data[i].Potential_kilowatts + "</h4>")
  );
}

// Add all the potentialMarkers to a new layer group.
let potentialLayer = L.layerGroup(potentialMarkers);

// Define variables for our tile layers.
let street = L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
    attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
})

let topo = L.tileLayer('https://{s}.tile.opentopomap.org/{z}/{x}/{y}.png', {
	attribution: 'Map data: &copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors, <a href="http://viewfinderpanoramas.org">SRTM</a> | Map style: &copy; <a href="https://opentopomap.org">OpenTopoMap</a> (<a href="https://creativecommons.org/licenses/by-sa/3.0/">CC-BY-SA</a>)'
});

// Only one base layer can be shown at a time.
let baseMaps = {
  Street: street,
  Topography: topo
};

// Overlays that can be toggled on or off
let overlayMaps = {
  Current: postcodeLayer,
  Potential: potentialLayer
};

// Create a map object, and set the default layers.
let myMap = L.map("map", {
  center: [-37.81, 144.96],
  zoom: 10,
  layers: [street, postcodeLayer]
});

// Pass our map layers into our layer control.
// Add the layer control to the map.
L.control.layers(baseMaps, overlayMaps, {collapsed: false}).addTo(myMap);

// Create legend 

let legend = L.control({position: 'bottomright'});

legend.onAdd = function (map) {

    let div = L.DomUtil.create('div', 'info legend'),
        grades = [0, 10000, 25000, 40000, 55000, 70000],
        labels = [];

    // loop through our density intervals and generate a label with a colored square for each interval
    for (let i = 0; i < grades.length; i++) {
        div.innerHTML +=
            '<i style="background:' + fillColor1(grades[i] + 1) + '"></i> ' +
            grades[i] + (grades[i + 1] ? '&ndash;' + grades[i + 1] + '<br>' : '+');
    }
    return div;
};

legend.addTo(myMap);



})