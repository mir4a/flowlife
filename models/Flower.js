var mongoose = require('mongoose');

var flowerSchema = new mongoose.Schema({
  name: { type:String, unique: true },
  species: { type: String, default: '' },
  wateringInterval: { type: Number, default: 1000*60*60*72 },
  lastWatering: { type: Date, default: new Date() },
  wateringCounter: { type: Number, default: 1 },
  live: { type: Boolean, default: true }
});


module.exports = mongoose.model('Flower', flowerSchema);