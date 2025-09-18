const mongoose = require("mongoose");
const { Schema } = mongoose;

const serviceSchema = new Schema({
  name: { type: String, required: true },
  description: { type: String },
  price: { type: Number, required: true },
  // duration: { type: Number }, // phút
  active: { type: Boolean, default: true },
}, { timestamps: true });

module.exports = mongoose.model("Service", serviceSchema);
