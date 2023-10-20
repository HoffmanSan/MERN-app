// Imports
const cloudinary = require("cloudinary").v2;

// Cloudinary config
cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
  secure: true
});

const options = {
  resource_type: "auto"
};

const uploadImage = (image) => {
  return new Promise((resolve, reject) => {
    cloudinary.uploader.upload(image, options, (error, result) => {
      if (result && result.secure_url) {
        return resolve(result.secure_url);
      }
        console.log(error.message);
        return reject({ message: error.message });
    });
  });
};


module.exports = {
  uploadImage
}