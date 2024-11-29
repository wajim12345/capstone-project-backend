const connection = require("../configs/db"); // Import the MySQL connection

// insert file details into the database
const uploadFile = (fileData, callback) => {
  const query = `
    INSERT INTO files (clientId, userId, urlId, fileName, filePath, fileSize, fileType, fileCategory)
    VALUES (?, ?, ?, ?, ?, ?, ?, ?);
  `;

  const fileDetails = [
    fileData.clientId || null,
    fileData.userId || null, 
    fileData.urlId,
    fileData.fileName,
    fileData.filePath,
    fileData.fileSize,
    fileData.fileType,
    fileData.fileCategory
  ];

  connection.query(query, fileDetails, (err, result) => {
    if (err) {
      return callback(err, null);
    }
    return callback(null, result.insertId);
  });
};


// retrieve files based on clientId
const findFileByClientId = (clientId) => {
  return new Promise((resolve, reject) => {
    const query = `
      SELECT * FROM files WHERE clientId = ?;
    `;

    connection.query(query, [clientId], (err, results) => {
      if (err) {
        return reject(err);
      }
      resolve(results);
    });
  });
};


const findFileById = (urlId) => {
  return new Promise((resolve, reject) => {
    const query = `
      SELECT * FROM files WHERE fileId = ?;
    `;

    connection.query(query, [urlId], (err, results) => {
      if (err) {
        return reject(err);
      }
      resolve(results);
    });
  });
};


const deleteFileById = (urlId, callback) => {
  const query = `DELETE FROM files WHERE urlId = ?`;
  connection.query(query, [urlId], (err, result) => {
    if (err) {
      return callback(err, null);
    }
    return callback(null, result);
  });
};

module.exports = {
  uploadFile,
  findFileByClientId,
  findFileById,
  deleteFileById
};
