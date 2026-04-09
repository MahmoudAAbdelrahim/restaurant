import mongoose from "mongoose";

const OrderSchema = new mongoose.Schema(
  {
    items: [
      {
        name: String,
        quantity: Number,
        price: Number,
      },
    ],
    customerInfo: {
      name: String,
      phone: String,
      address: String,
    },
    orderType: { type: String, enum: ["delivery", "in-restaurant"] },
    tableNumber: Number,
    deliveryFee: Number,
    total: Number,
    status: {
      type: String,
      enum: ["pending", "preparing", "done"],
      default: "pending",
    },
  },
  { timestamps: true }
);

export default mongoose.models.Order || mongoose.model("Order", OrderSchema);