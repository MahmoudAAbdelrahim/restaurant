import mongoose from "mongoose";

const MenuSchema = new mongoose.Schema(
  {
    name: { type: String, required: true },
    price: { type: Number, required: true },
    category: { 
      type: String, 
      enum: ["meals", "drinks", "grills"], 
      default: "meals" 
    },
    description: { type: String },
    discount: { type: Number, default: 0 },
    images: { type: [String], default: [] },
  },
  { timestamps: true }
);

export default mongoose.models.Menu || mongoose.model("Menu", MenuSchema);