const express = require("express");
const {
  getAllInvoicesController,
  getInvoicesByUserIdController,
  deleteInvoiceController,
  updateInvoiceController,
  createInvoiceController,
} = require("../controllers/invoiceController");
const {
  authenticateToken,
  authorizeAdmin,
} = require("../middleware/authMiddleware");

const router = express.Router();

// Get all invoices - Admin authentication required
router.get("/", authenticateToken, authorizeAdmin, getAllInvoicesController);

// Create a new invoice - User authentication required
router.post("/", authenticateToken, createInvoiceController);
// Get invoices by user ID - User authentication required
router.get("/:userId", authenticateToken, getInvoicesByUserIdController);

// Delete an invoice - User authentication required
router.delete("/:invoiceId", authenticateToken, deleteInvoiceController);

// Update an invoice - User authentication required
router.patch("/:invoiceId", authenticateToken, updateInvoiceController);

module.exports = router;
