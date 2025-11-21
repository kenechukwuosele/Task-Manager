import multer from "multer";
import path from "path";

// Configure storage
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    const uploadDir = path.join(__dirname, "../uploads"); // Adjust path relative to this file
    cb(null, uploadDir); // Ensure this folder exists or will be created
  },
  filename: (req, file, cb) => {
    // Sanitize filename and ensure unique name
    const uniqueSuffix = Date.now() + "-" + Math.round(Math.random() * 1E9);
    const ext = path.extname(file.originalname); // Get file extension
    const basename = path.basename(file.originalname, ext).replace(/[^a-zA-Z0-9]/g, "-"); // Sanitize basename
    cb(null, `${basename}-${uniqueSuffix}${ext}`);
  },
});

// File filter to allow only images (optional but recommended)
const fileFilter = (req, file, cb) => {
  const allowedTypes = /jpeg|jpg|png|gif/;
  const ext = path.extname(file.originalname).toLowerCase();
  const mimetype = allowedTypes.test(file.mimetype);

  if (mimetype && allowedTypes.test(ext)) {
    cb(null, true);
  } else {
    cb(new Error("Only image files (jpeg, jpg, png, gif) are allowed!"), false);
  }
};

// Create upload instance
const upload = multer({
  storage: storage,
  fileFilter: fileFilter,
  limits: { fileSize: 1024 * 1024 * 5 }, // Limit to 5MB (adjust as needed)
});

export default upload;