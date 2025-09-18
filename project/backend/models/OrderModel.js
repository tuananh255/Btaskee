const mongoose = require("mongoose");
const { Schema } = mongoose;

const orderSchema = new Schema(
  {
    customer: { type: Schema.Types.ObjectId, ref: "Customer", required: true },
    staff: { type: Schema.Types.ObjectId, ref: "User" }, // phân công sau
    service: { type: Schema.Types.ObjectId, ref: "Service", required: true },
    branch: { type: Schema.Types.ObjectId, ref: "Branch" },
    status: {
      type: String,
      enum: ["assigning", "pending", "accepted", "in_progress", "completed", "canceled"],
      default: "assigning", // mới book mặc định là "đang phân công"
    },
    scheduledAt: { type: Date, required: true },
    completedAt: { type: Date },
    price: { type: Number },
    notes: { type: String },
    paymentMethod: { type: String, enum: ["COD", "Online"], default: "COD" },
    paymentStatus: { type: String, enum: ["unpaid", "paid"], default: "unpaid" },
  },
  { timestamps: true }
);

module.exports = mongoose.model("Order", orderSchema);
