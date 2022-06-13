const electron = require("electron");
const url = require("url");
const path = require("path");
const { usersDB, locationsDB } = require("./config/db");
const { ObjectId } = require("mongodb");

const { app, ipcMain, BrowserWindow, Menu } = electron;
let userScreen;
let loginScreen;
let mapScreen;
let coordinates = [];
// const coordinates;

////////////////////////////////////////////--------------------------------///////////////////////////
app.on("ready", function () {
  loginScreen = new BrowserWindow({
    webPreferences: {
      nodeIntegration: true,
      contextIsolation: false,
    },
  });

  loginScreen.loadURL(
    url.format({
      pathname: path.join(__dirname, "./pages/LoginScreen.html"),
      protocol: "file",
      slashes: true,
    })
  );

  const mainMenu = Menu.buildFromTemplate(mainMenuTemplate);
  Menu.setApplicationMenu(mainMenu);

  ///////////////Sign Up/////////////////
  ipcMain.on("signup", async function (e, { email, password }) {
    try {
      await usersDB.create({ email, password });
    } catch (error) {
      console.log(error);
    }
  });

  ///////////////Log In/////////////////
  ipcMain.on("login", async function (e, { email, password }) {
    try {
      await usersDB.findOne({ email: email }, function (err, results) {
        if (err) {
          console.log(err);
        } else {
          console.log(results._id.valueOf());
          if (!results || results.password !== password) {
            loginScreen.webContents.send("login:error");
          } else {
            createScreens();
          }
        }
      });
    } catch (error) {
      console.log(error);
    }
  });
});

ipcMain.on("deleteAddress", async function (e, id) {
  await locationsDB.deleteOne({ _id: ObjectId(id) }, function (err) {
    if (err) {
      console.log(err);
    } else {
      drawMap();
    }
  });
});

//////////////////////////-----------------------------------------///////////////////////////
ipcMain.on("newCoordinates", async function (e, { lat, lng, address }) {
  // mapScreen.webContents.send("newCoordinates", { lat, lng });
  ////////////////////////////////Yeni koordinatı DB'ye yükler/////////////////////////
  try {
    await locationsDB.create({ lat, lng, address });
  } catch (error) {
    console.log(error);
  }

  ////////////////////////////////Yüklenen koordinatın id'sini userScreen'e gönderir/////////////////////
  try {
    await locationsDB.findOne({ lat: lat, lng: lng }, function (err, foundOne) {
      if (err) {
        console.log(err);
      } else {
        const id = foundOne._doc._id.valueOf();
        userScreen.webContents.send("newLocation", [foundOne, id]);
      }
    });
  } catch (error) {
    console.log(error);
  }

  /////////////////////////////////DB'yi mapScreen'e gönderir///////////////////////////////////////
  drawMap();
});

//////////////////////////////////-----------------------------------//////////////////////////

async function drawMap() {
  try {
    await locationsDB.find(function (err, db) {
      if (err) {
        console.log(err);
      } else {
        coordinates = db;
        mapScreen.webContents.send("drawMap", db);
      }
    });
  } catch (error) {
    console.log(error);
  }
}
///////////////////////////////-------------------------------------///////////////////////////

function createScreens() {
  loginScreen.close();
  loginScreen = null;

  // ////////////////////////////MAP SCREEN//////////////////////////////
  mapScreen = new BrowserWindow({
    x: 800,
    y: 120,
    webPreferences: {
      nodeIntegration: true,
      contextIsolation: false,
    },
  });

  mapScreen.loadURL(
    url.format({
      pathname: path.join(__dirname, "./pages/MapScreen.html"),
      protocol: "file",
      slashes: true,
    })
  );

  // //////////////////////////////USER SCREEN//////////////////////////////
  userScreen = new BrowserWindow({
    x: 0,
    y: 120,
    webPreferences: {
      nodeIntegration: true,
      contextIsolation: false,
    },
  });

  userScreen.loadURL(
    url.format({
      pathname: path.join(__dirname, "./pages/UserScreen.html"),
      protocol: "file",
      slashes: true,
    })
  );
  /////////////////////////////////DB'yi temizler/////////////////////////////////////
  userScreen.on("close", async function () {
    try {
      await locationsDB.deleteMany();
    } catch (error) {
      console.log(error);
    }
  });
}

/////////////////////////////////////////------------------------------------/////////////////////////////
const mainMenuTemplate = [
  {
    label: "Çıkış",
    click() {
      app.quit();
    },
  },
];

if (process.env.NODE_ENV !== "production") {
  mainMenuTemplate.push({
    label: "Developer Tools",
    submenu: [
      {
        label: "Toggle DevTools",
        accelerator: process.platform === "darwin" ? "Command+I" : "Control+I",
        click(item, focusedWindow) {
          focusedWindow.toggleDevTools();
        },
      },
      {
        role: "reload",
      },
    ],
  });
}
