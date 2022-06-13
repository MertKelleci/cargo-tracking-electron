const { MongoServerClosedError } = require("mongodb");
const mongoose = require("mongoose");
const autoIncrement = require("mongoose-auto-increment");

const usersConnection = mongoose.createConnection(
  "mongodb+srv://<USERNAME:PASSWORD>@mertserver.mei0v.mongodb.net/users?retryWrites=true&w=majority"
);
autoIncrement.initialize(usersConnection);
const userSchema = new mongoose.Schema({
  email: {
    type: String,
    required: [true, "eMail Gerekli."],
  },
  password: {
    type: String,
    required: [true, "Şifre Gerekli."],
  },
});

const locationsConnection = mongoose.createConnection(
  "mongodb+srv://<USERNAME:PASSWORD>@mertserver.mei0v.mongodb.net/locations?retryWrites=true&w=majority"
);
autoIncrement.initialize(locationsConnection);
const locationSchema = new mongoose.Schema({
  lat: Number,
  lng: Number,
  address: {
    type: String,
    required: [true, "Adres Gerekli"],
  },
});

const usersDB = usersConnection.model("users", userSchema);
const locationsDB = locationsConnection.model("locations", locationSchema);

module.exports = { usersDB, locationsDB };
