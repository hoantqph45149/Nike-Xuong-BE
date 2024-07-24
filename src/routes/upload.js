import { Router } from "express";
import { removImage, uploadImage } from "../controllers/images.js";
import { CloudinaryStorage } from "multer-storage-cloudinary";
import cloudinary from "../configs/cloudinaryConfig.js";
import multer from "multer";
const routerImage = Router();

const storage = new CloudinaryStorage({
  cloudinary: cloudinary,
  params: {
    folder: "images",
    format: "jpg",
  },
});
const upload = multer({ storage: storage });
routerImage.post("/upload", upload.array("image"), uploadImage);
routerImage.delete("/remove/:publicId", removImage);

export default routerImage;
