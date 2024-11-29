const connection = require("../configs/db");

const getAllInvoices = (callback) => {
  const query = "SELECT * FROM Invoice";
  connection.query(query, callback);
};

  const createInvoice = (invoiceData, callback) => {
    const query = `
      INSERT INTO Invoice (userId, firstName, lastName, month, rate, hours, isGiven)
      VALUES (?, ?, ?, ?, ?, ?, ?)
    `;
    const values = [
      invoiceData.userId,
      invoiceData.firstName,
      invoiceData.lastName,
      invoiceData.month,
      invoiceData.rate,
      invoiceData.hours,
      invoiceData.isGiven || false, // Default to false if not provided
    ];
  
    connection.query(query, values, callback);
  };

const getInvoicesByUserId = (userId, callback) => {
  const query = "SELECT * FROM Invoice WHERE userId = ?";
  connection.query(query, [userId], callback);
};

const getInvoiceById = (invoiceId, callback) => {
  const query = "SELECT * FROM Invoice WHERE invoiceId = ?";
  connection.query(query, [invoiceId], callback);
};

const deleteInvoiceById = (invoiceId, callback) => {
  const query = "DELETE FROM Invoice WHERE invoiceId = ?";
  connection.query(query, [invoiceId], callback);
};

const updateInvoiceById = (invoiceId, invoiceData, callback) => {
  const fields = [];
  const values = [];

  Object.keys(invoiceData).forEach((key) => {
    if (invoiceData[key] !== undefined) {
      fields.push(`${key} = ?`);
      values.push(invoiceData[key]);
    }
  });

  const query = `UPDATE Invoice SET ${fields.join(", ")} WHERE invoiceId = ?`;
  values.push(invoiceId);

  connection.query(query, values, callback);
};

module.exports = {
  getAllInvoices,
  getInvoicesByUserId,
  getInvoiceById,
  deleteInvoiceById,
  updateInvoiceById,
  createInvoice,
};
