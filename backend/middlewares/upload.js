const multer = require("multer");
const path = require("path");
const fs = require("fs");

// Pastikan folder upload ada
const uploadPath = "public/images";

if (!fs.existsSync(uploadPath)) {
  fs.mkdirSync(uploadPath, { recursive: true });
}

// Konfigurasi penyimpanan file
const storage = multer.diskStorage({

  destination: (req, file, cb) => {
    cb(null, uploadPath);
  },

  filename: (req, file, cb) => {

    const uniqueName =
      Date.now() + "-" + Math.round(Math.random() * 1e9);

    cb(null, uniqueName + path.extname(file.originalname));

  }

});


// Filter hanya gambar
const fileFilter = (req, file, cb) => {

  const allowedTypes = /jpg|jpeg|png|webp/;

  const ext = allowedTypes.test(
    path.extname(file.originalname).toLowerCase()
  );

  const mime = allowedTypes.test(file.mimetype);

  if (ext && mime) {
    return cb(null, true);
  }

  cb(new Error("File harus berupa gambar (jpg, jpeg, png, webp)"));

};


// Konfigurasi multer
const upload = multer({

  storage: storage,

  limits: {
    fileSize: 5 * 1024 * 1024 // max 5MB
  },

  fileFilter: fileFilter

});


module.exports = upload;