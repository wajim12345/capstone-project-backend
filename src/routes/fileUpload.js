const express = require("express");
const upload = require("../utils/uploadFile");
const router = express.Router();
const {
  uploadSingleController,
  deleteFileController,
  getFilesByClientIdController,
  getFilesByIdController,
} = require("../controllers/fileUploadController");
const {
  authenticateToken,
  authorizeAdmin,
} = require("../middleware/authMiddleware");

// protect routes
router.post(
  "/upload",
  upload.single("file"),
  authenticateToken,
  authorizeAdmin,
  uploadSingleController
);
router.delete(
  "/delete/:urlId",
  authenticateToken,
  authorizeAdmin,
  deleteFileController
);
router.get(
  "/client/:clientId",
  authenticateToken,
  getFilesByClientIdController
);
router.get(
  "/:fileId",
  authenticateToken,
  getFilesByIdController
);

module.exports = router;
