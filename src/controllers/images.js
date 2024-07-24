import cloudinary from "../configs/cloudinaryConfig.js";

export const uploadImage = async (req, res) => {
  try {
    const images = req.files.map((file) => {
      file.path;
    });

    const uploadedImages = [];

    for (let image of images) {
      const result = await cloudinary.uploader.upload(image);
      console.log(result);
      uploadedImages.push({
        url: result.secure_url,
        publicId: result.public_id,
      });
    }
    return res.status(200).json({
      message: "Upload ảnh thành công",
      data: uploadedImages,
    });
  } catch (error) {
    return res.status(500).json({
      name: error.name,
      message: error.message,
    });
  }
};

export const removImage = async (req, res) => {
  try {
    const publicId = req.params.publicId;
    const results = await cloudinary.uploader.destroy(publicId);
    if (results.result === "not found") {
      throw new Error("delete image failed");
    }
    return res.status(200).json({
      message: "Delete ảnh thành công",
    });
  } catch (error) {
    return res.status(500).json({
      message: error.message,
    });
  }
};
