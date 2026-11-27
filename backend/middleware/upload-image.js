import multer from "multer";

const ALLOWED_TYPES = [
  "image/jpeg",
  "image/png",
  "image/webp",
];

export const uploadImage = multer({
  storage: multer.memoryStorage(),

  limits: {
    fileSize: 4 * 1024 * 1024,
    files: 1,
  },

  fileFilter: (req, file, callback) => {
    if (!ALLOWED_TYPES.includes(file.mimetype)) {
      return callback(
        new Error("Only JPG, PNG and WebP images are allowed.")
      );
    }

    callback(null, true);
  },
});