var mongoose = require('mongoose');

var flowerSchema = new mongoose.Schema({
  name: { type:String, unique: true },
  species: { type: String, default: '' },
  wateringInterval: { type: Number, default: 1000*60*60*72 },
  lastWatering: { type: Date, default: new Date() },
  wateringCounter: { type: Number, default: 1 },
  live: { type: Boolean, default: true }
});

/**
 * Calculate next watering
 */
//FIXME: Doesn't work at child call, work if called from parent, like user.flowers[0].nextWatering()
flowerSchema.methods.nextWatering = function(){
  var wateringDate = this.lastWatering;
  wateringDate.setDate(this.lastWatering.getDate() + this.wateringInterval);
  return wateringDate.toUTCString();
};


module.exports = mongoose.model('Flower', flowerSchema);