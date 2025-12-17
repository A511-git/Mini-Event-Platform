import cloudinary from "cloudinary";
import fs from "fs";

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});
const CloudinaryUpload = async (file) => {
  try {
    if (!file || !file.path) {
      throw new Error("Invalid file input");
    }

    const result = await cloudinary.uploader.upload(file.path, {
      resource_type: "auto",
    });

    fs.unlinkSync(file.path);
    return result;
  } catch (error) {
    if (file?.path && fs.existsSync(file.path)) {
      fs.unlinkSync(file.path);
    }
    return null;
  }
};



export { CloudinaryUpload };
