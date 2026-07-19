const cloudinary = require("../config/cloudinary");

const uploadToCloudinary = async (
  filePath,
  folder = "boardroom/documents"
) => {
  try {
    const result = await cloudinary.uploader.upload(filePath, {
      resource_type: "raw",
      folder,
    });

    return result;
  } catch (error) {
    throw new Error("Cloudinary upload failed");
  }
};

module.exports = uploadToCloudinary;