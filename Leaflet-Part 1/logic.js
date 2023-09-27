
//Map object
let mMap=L.map("map", {
  center:[15.5994, -28.6731],
  zoom:2.4
});

//Tile layer
L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
    attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
}).addTo(mMap);

//API endpoint
let Url="https://earthquake.usgs.gov/earthquakes/feed/v1.0/summary/2.5_day.geojson";

//Function for markersize
function markerSize(magnitude) {
  return Math.sqrt(magnitude) * 750000;
}

//Function for legend colors
function getColor(d){
  return d > 90 ? "darkred" :
         d > 70 ? "firebrick":
         d > 50 ? "red" :
         d > 30 ? "crimson":
         d > 10 ? "indianred":
                      "lightcoral";
}
//Get request to the Url and data is send to Feature function
d3.json(Url).then(function (data) {
  // console.log(data)
  eQuake=data.features
  //console.log(eQuake)

  //For loop through each earthquake
  for(let i=0; i < eQuake.length; i++){

    let location=eQuake[i].geometry

    let quake=eQuake[i].properties

    let color=" ";

    //Designating color based on depth
    if (location.coordinates[2] > 90){
      color="darkred"
    }
    else if (location.coordinates[2] > 70){
      color="firebrick"
    }
    else if (location.coordinates[2] > 50){
      color="red"
    }
    else if (location.coordinates[2] >30){
      color="crimson"
    }
    else if (location.coordinates[2] > 10){
      color="indianred"
    }
    else {
      color="lightcoral"
    }

    //Creating circle markers with size based on magnitude and color as depth
    L.circle([location.coordinates[1], location.coordinates[0]],{
      fillOpacity:0.9,
      color: color,
      weight:1,
      fillColor: color,
      radius: markerSize(quake.mag)
    }).bindPopup("<h3>Location: " + quake.place + "<h3><h3>Magnitude: " + quake.mag + "<h3><h3>Depth: " + location.coordinates[2]+"</h3").addTo(mMap)
  }

  //Creating legend and customizing it
  let  legend=L.control({position:"bottomright"});

  legend.onAdd=function(map){
    let div=L.DomUtil.create('div','info legend'),
    depth=[-10,10,30,50,70,90],
    labels=[];

    //For loop through depth categories and designating color
    for(let i=0; i < depth.length; i++){
      div.innerHTML +=
        '<i style="background:' + getColor(depth[i] + 1) + '"></i> ' +
            depth[i] + (depth[i + 1] ? '&ndash;' + depth[i + 1] + '<br>' : '+');
    }

    return div;
};

legend.addTo(mMap);

});




