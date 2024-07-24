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
    description: {
      type: String,
    },
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
