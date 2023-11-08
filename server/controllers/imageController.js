// Imports
const cloudinary = require("cloudinary").v2;

// Cloudinary config
cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
  secure: true
});

// Upload a new image
const uploadImage = async (req, res) => {
  const image = req.body.image
  const folderId = req.body.folder

  await cloudinary.uploader.upload(image, {
      resource_type: "auto",
      folder: "Sklepico" + folderId
    }
  ).then(result => {
    res.status(200).json(result.secure_url)
  }).catch(error => {
    res.status(400).json({error: error.message});
  })
};

// Delete an image
const deleteImage = async (req, res) => {
  const { folder, id } = req.params

  await cloudinary.api.delete_resources_by_prefix(`Sklepico/${folder}/${id}`)
    .then(async () => {
      await cloudinary.api.delete_folder(`Sklepico/${folder}/${id}`)
      .then(result => {
          res.status(200).json(result)
        })
        .catch(error => {
          res.status(400).json({error: error.message})
        })
    })
    .catch(error => {
      res.status(400).json({error: error.message})
    })
}

module.exports = {
  uploadImage,
  deleteImage
}