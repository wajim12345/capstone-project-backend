const connection = require("../configs/db");

const getAllOutsideProviders = (callback) => {
  const query = "SELECT * FROM OutsideProvider";
  connection.query(query, callback);
};

const createOutsideProvider = (provider) => {
  return new Promise((resolve, reject) => {
    const query = `
      INSERT INTO OutsideProvider (
        firstName, lastName, phoneNumber, email, agency
      ) VALUES (?, ?, ?, ?, ?)
    `;
    const values = [
      provider.firstName,
      provider.lastName,
      provider.phoneNumber,
      provider.email,
      provider.agency,
    ];

    connection.query(query, values, (err, results) => {
      if (err) {
        return reject(err);
      }

      const getProviderQuery =
        "SELECT * FROM OutsideProvider WHERE outsideProviderId = ?";
      connection.query(
        getProviderQuery,
        [results.insertId],
        (err, providerResults) => {
          if (err) {
            return reject(err);
          }
          resolve(providerResults[0]);
        }
      );
    });
  });
};

const getOutsideProviderById = (outsideProviderId) => {
  return new Promise((resolve, reject) => {
    const query = "SELECT * FROM OutsideProvider WHERE outsideProviderId = ?";
    connection.query(query, [outsideProviderId], (err, results) => {
      if (err) {
        reject(err);
      } else {
        // Check if we have a result
        resolve(results.length > 0 ? results[0] : null);
      }
    });
  });
};

const updateOutsideProviderById = (outsideProviderId, provider) => {
  return new Promise((resolve, reject) => {
    const fields = [];
    const values = [];

    Object.keys(provider).forEach((key) => {
      if (provider[key] !== undefined) {
        fields.push(`${key} = ?`);
        values.push(provider[key]);
      }
    });

    const query = `UPDATE OutsideProvider SET ${fields.join(
      ", "
    )} WHERE outsideProviderId = ?`;
    values.push(outsideProviderId);

    connection.query(query, values, (err, results) => {
      if (err) {
        return reject(err);
      }
      resolve(results);
    });
  });
};

const deleteOutsideProviderById = (outsideProviderId) => {
  return new Promise((resolve, reject) => {
    const query = "DELETE FROM OutsideProvider WHERE outsideProviderId = ?";
    connection.query(query, [outsideProviderId], (err, results) => {
      if (err) {
        return reject(err);
      }
      resolve(results);
    });
  });
};

const getOutsideProviderByEmail = (email) => {
  return new Promise((resolve, reject) => {
    const query = "SELECT * FROM OutsideProvider WHERE email = ?";
    connection.query(query, [email], (err, results) => {
      if (err) {
        reject(err);
      } else {
        resolve(results.length > 0 ? results[0] : null);
      }
    });
  });
};

module.exports = {
  getAllOutsideProviders,
  createOutsideProvider,
  getOutsideProviderById,
  updateOutsideProviderById,
  deleteOutsideProviderById,
  getOutsideProviderByEmail,
};
