const electron = require("electron");
const { ipcRenderer } = electron;
const { travelingSalesman } = require("../config/TravelingSalesman");
let map;
let markers = [];

function initMap() {
  const myLatLng = { lat: 40.7603830019582, lng: 29.923368897805183 };
  map = new google.maps.Map(document.getElementById("map"), {
    center: myLatLng,
    zoom: 13,
  });

  const shippingIcon = new google.maps.Marker({
    position: myLatLng,
    map,
    title: "Başlangıç Noktası",
    icon: "../icons/warehousex32.png",
  });
}

ipcRenderer.on("drawMap", function (e, db) {
  // travelingSalesman(db);
  for (let i = 0; i < markers.length; i++) {
    markers[i].setMap(null);
  }

  markers = [];

  for (let i = 0; i < db.length; i++) {
    const { lat, lng } = db[i]._doc;

    const newIcon = new google.maps.Marker({
      position: { lat, lng },
      map,
      title: "Teslimat Noktası",
      icon: "../icons/shippingx32.png",
    });

    markers.push(newIcon);
  }
});
