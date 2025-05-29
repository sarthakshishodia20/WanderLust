const cloudinary = require('cloudinary').v2;
const { CloudinaryStorage } = require('multer-storage-cloudinary');

cloudinary.config({
    cloud_name: process.env.CLOUD_NAME,
    api_key: process.env.CLOUD_API_KEY,
    api_secret: process.env.CLOUD_API_SECRET,
});

const storage = new CloudinaryStorage({
    cloudinary: cloudinary,
    params: {
      folder: "WanderLust_DEV",
      allowed_formats: ["jpg", "png", "jpeg"], // 'allowed_formats' instead of 'allowedFormat'
    },
});
module.exports = { cloudinary, storage }; 