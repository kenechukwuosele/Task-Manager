import multer from "multer";

// Configure storage (optional: can use diskStorage for custom filename)
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, "uploads/"); // make sure this folder exists
  },
  filename: (req, file, cb) => {
    cb(null, Date.now() + "-" + file.originalname);
  }
});

// Create upload instance
const Upload = multer({ storage: storage });

export default Upload;
