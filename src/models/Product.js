import mongoose from "mongoose";
import mongoosePaginate from "mongoose-paginate-v2";

const productSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: true,
      minlength: 3,
    },
    price: {
      type: Number,
      required: true,
      min: 1,
    },
    thumbnail: {
      type: String,
      required: true,
    },
    description: {
      type: String,
    },
    colors: [{ color: { type: String, required: true } }],
    gender: {
      type: String,
      enum: ["Man", "Woman", "Unisex"],
      required: true,
    },
    sizes: [
      {
        size: {
          type: String,
          required: true,
        },
        quantity: {
          type: Number,
          required: true,
        },
      },
    ],
    categoryId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Category",
      required: true,
    },
  },
  { timestamps: true, versionKey: false }
);

productSchema.plugin(mongoosePaginate);
const Product = mongoose.model("Product", productSchema);

export default Product;
