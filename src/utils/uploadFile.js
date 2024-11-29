const multer = require("multer");
const storage = multer.memoryStorage();

// file size limit and file type
const upload = multer({
  storage: storage,
  limits: { fileSize: 5 * 1024 * 1024 }, // Limit file size to 5MB
  fileFilter: (req, file, cb) => {
    // Allowed file types 
    const allowedMimeTypes = [
      "application/vnd.openxmlformats-officedocument.wordprocessingml.document", // DOCX
      "application/pdf",
      "image/jpeg",
      "image/png",
    ];

    if (!allowedMimeTypes.includes(file.mimetype)) {
      return cb(
        new Error(
          "Invalid file type. Only PDF, DOCX, JPEG, PNG, and GIF are allowed."
        )
      );
    }

    cb(null, true);
  },
});

module.exports = upload;
