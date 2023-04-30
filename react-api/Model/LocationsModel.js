// import schema
const mongoose = require("mongoose");
const Schema = mongoose.Schema;
// create schema
const LocationsSchema = new Schema({
  name: { type: String },
  city_id: { type: Number },
  location_id: { type: Number },
  city: { type: String },
  country_name: { type: String },
});
// create model
// singular => location
// plural => locations
const LocationsModel = mongoose.model("location", LocationsSchema, "locations");
//location

module.exports = LocationsModel;
