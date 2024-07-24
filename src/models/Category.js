import mongoose from "mongoose";

const categorySchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
      unique: true,
      defaultValue: "UnCategorized",
    },
    slug: String,
    description: String,
    products: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Product",
      },
    ],
    isHidden: { type: Boolean, default: false },
  },
  { timestamps: true, versionKey: false }
);

const Category = mongoose.model("Category", categorySchema);

export default Category;
