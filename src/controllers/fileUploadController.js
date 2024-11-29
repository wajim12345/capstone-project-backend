const { Storage } = require("@google-cloud/storage");
const path = require("path");
const {
  uploadFile,
  findFileByClientId,
  findFileById,
  deleteFileById,
} = require("../models/fileModel");

// initialize google cloud
const storage = new Storage({
  projectId: process.env.GOOGLE_PROJECT_ID,
  credentials: {
    private_key: process.env.GOOGLE_PRIVATE_KEY.replace(/\\n/g, "\n"),
    client_email: process.env.GOOGLE_CLIENT_EMAIL,
  },
});

const bucketName = process.env.GOOGLE_CLOUD_BUCKET_NAME;
const bucket = storage.bucket(bucketName);
const { v4: uuidv4 } = require("uuid");
const { getTeamMembersByClientId } = require("../models/teamMemberModel");

// single file upload
async function uploadSingleController(req, res) {
  if (!req.file) {
    return res.status(400).send("No file uploaded.");
  }

  try {
    const file = req.file;
    // const blob = bucket.file(file.originalname);
    const fileId = uuidv4();
    const blob = bucket.file(fileId);
    const blobStream = blob.createWriteStream({
      resumable: false,
      contentType: file.mimetype,
    });

    blobStream.on("error", (err) => {
      return res.status(500).json({
        message: "Error uploading file to Google Cloud Storage.",
        error: err,
      });
    });

    blobStream.on("finish", () => {
      const publicUrl = `https://storage.googleapis.com/${bucketName}/${fileId}`;
      const fileData = {
        clientId: req.body.clientId || null,
        userId: req.body.userId || null,
        urlId: fileId,
        fileName: file.originalname,
        filePath: publicUrl,
        fileSize: file.size,
        fileType: file.mimetype,
        fileCategory: req.body.fileCategory,
      };
      uploadFile(fileData, (err, insertId) => {
        if (err) {
          return res.status(500).json({
            message: "Error saving file metadata to the database.",
            error: err,
          });
        }

        // Return the file metadata including the newly inserted file ID
        res.json({
          message: "File successfully uploaded and metadata saved",
          fileUrl: publicUrl,
          fileId: insertId,
        });
      });
    });

    // upload the file
    blobStream.end(file.buffer);
  } catch (error) {
    res.status(500).json({ message: "Error uploading file.", error });
  }
}

// file delete
const deleteFileController = async (req, res) => {
  const urlId = req.params.urlId;

  try {
    // Step 1: Find the file in the database using urlId
    findFileById(urlId, async (err, files) => {
      if (err) {
        return res.status(500).json({
          message: "Error retrieving file from database.",
          error: err,
        });
      }

      if (!files || files.length === 0) {
        return res
          .status(404)
          .json({ message: "No file found with the given urlId." });
      }

      const fileData = files[0];

      const file = bucket.file(fileData.urlId);
      await file.delete();

      deleteFileById(urlId, (err, result) => {
        if (err) {
          return res.status(500).json({
            message: "Error deleting file from database.",
            error: err,
          });
        }

        res.json({ message: `Successfully deleted file: ${urlId}` });
      });
    });
  } catch (err) {
    return res.status(500).json({
      message: "Error deleting file from Google Cloud Storage.",
      error: err,
    });
  }
};

const getFilesByClientIdController = async (req, res) => {
  const clientId = req.params.clientId;
  const loggedInUserId = req.user.id;
  const isAdmin = req.user.isAdmin;

  if (!clientId) {
    return res.status(400).json({ message: "Client ID is required" });
  }

  try {
    // Check if the user is an admin
    if (!isAdmin) {
      // If not an admin, check if the user is part of the team for this client
      const teamMembers = await getTeamMembersByClientId(clientId);

      const isTeamMember = teamMembers.some(
        (member) => String(member.userId) === String(loggedInUserId)
      );

      if (!isTeamMember) {
        return res.status(403).json({
          message: "You are not authorized to view files for this client.",
        });
      }
    }

    // Fetch files by clientId
    const files = await findFileByClientId(clientId);

    if (!files || files.length === 0) {
      return res
        .status(404)
        .json({ message: "No files found for the given clientId." });
    }

    // Return the files
    res.status(200).json({ files });
  } catch (err) {
    console.error("Error retrieving files:", err);
    return res
      .status(500)
      .json({ message: "Error retrieving files.", error: err });
  }
};

// const getFilesByIdController = async (req, res) => {
const getFilesByIdController = async (req, res) => {
  const fileId = req.params.fileId;
  const loggedInUserId = req.user.id;
  const isAdmin = req.user.isAdmin;

  if (!fileId) {
    return res.status(400).json({ message: "File ID is required" });
  }

  try {
    // Fetch file information by fileId
    const files = await findFileById(fileId);

    if (!files || files.length === 0) {
      return res.status(404).json({ message: "No files found for the given fileId." });
    }

    const file = files[0];

    // Check if the user is authorized
    if (!isAdmin) {
      // If not an admin, check if the user is part of the team for this file's client
      const teamMembers = await getTeamMembersByClientId(file.clientId);

      const isTeamMember = teamMembers.some(
        (member) => String(member.userId) === String(loggedInUserId)
      );

      if (!isTeamMember) {
        return res.status(403).json({
          message: "You are not authorized to view this file.",
        });
      }
    }

    // Extract the object name from file.filePath
    const bucketName = "capstone-upload-ba";
    const fileName = file.filePath.replace(
      "https://storage.googleapis.com/capstone-upload-ba/",
      ""
    );

    // Check if the file exists in the bucket
    const fileExists = await storage.bucket(bucketName).file(fileName).exists();
    if (!fileExists[0]) {
      return res.status(404).json({ message: "File does not exist in the bucket." });
    }

    // Generate a signed URL for the private file
    const options = {
      version: "v4",
      action: "read",
      expires: Date.now() + 15 * 60 * 1000, // 15 minutes
    };

    const [signedUrl] = await storage.bucket(bucketName).file(fileName).getSignedUrl(options);

    res.status(200).json({
      fileId: file.fileId,
      clientId: file.clientId,
      fileName: file.fileName,
      fileType: file.fileType,
      fileSize: file.fileSize,
      createdAt: file.createdAt,
      signedUrl,
    });
  } catch (err) {
    console.error("Error retrieving file:", err);
    return res.status(500).json({ message: "Error retrieving file.", error: err });
  }
};

module.exports = {
  uploadSingleController,
  getFilesByClientIdController,
  getFilesByIdController,
  deleteFileController,
};
