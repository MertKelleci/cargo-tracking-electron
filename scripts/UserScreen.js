const { ipcRenderer } = require("electron");
const ekleButon = document.querySelector("#ekleButon");

ekleButon.addEventListener("click", function () {
  geocode();
});

function geocode() {
  let location = document.querySelector("#adres").value;
  axios
    .get("https://maps.googleapis.com/maps/api/geocode/json?", {
      params: {
        address: location,
        key: "<YOUR GEOCODE KEY>",
      },
    })
    .then(function (response) {
      const { lat, lng } = response.data.results[0].geometry.location;
      const address = location;
      ipcRenderer.send("newCoordinates", { lat, lng, address });
      document.querySelector("#adres").value = "";
    })
    .catch(function (err) {
      // console.log(err);
    });
}

ipcRenderer.on("newLocation", function (e, [location, id]) {
  const container = document.querySelector(".adress-container");
  ///////////////////////////////////////////////
  const row = document.createElement("div");
  row.className = "row";
  ///////////////////////////////////////////////
  const col = document.createElement("div");
  col.className =
    "adress-collumn p-2 mb-3 text-light bg-dark col-md-8 offset-2 shadow card d-flex justify-content-center flex-row align-items-center";
  //////////////////////////////////////////////
  const p = document.createElement("p");
  p.className = "m-0 w-100";
  p.innerText = location._doc.address;
  //////////////////////////////////////////////
  const button = document.createElement("button");
  button.className = "silButton btn btn-danger";
  button.innerText = "Sil";
  button.id = id;
  ///////////////////////////////////////////////

  button.addEventListener("click", function (e) {
    ipcRenderer.send("deleteAddress", e.target.id);
    e.target.parentElement.parentElement.remove();
  });

  col.appendChild(p);
  col.appendChild(button);

  row.appendChild(col);
  container.appendChild(row);
});
