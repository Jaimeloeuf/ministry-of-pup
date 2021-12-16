const {
  generateHeader,
  generateFooter,
  generateTableRow,
  generateHr,
  formatCurrency,
  formatDate,
} = require("./commonUtils.js");

function create(PDFDocument, data) {
  const doc = new PDFDocument({ size: "A4", margin: 50 });

  generateHeader(doc);
  generateReceiptAndCustomerTable(doc, data);
  generateItemTable(doc, data);
  generateFooter(
    doc,
    "Payment is due within 15 days. Thank you for your business."
  );

  doc.end();

  return doc;
}

function generateReceiptAndCustomerTable(doc, data) {
  doc.fillColor("#444444").fontSize(20).text("Invoice", 50, 160);

  generateHr(doc);

  const customerInformationTop = 200;

  doc
    .fontSize(10)
    .text("Invoice Number:", 50, customerInformationTop)
    .font("Helvetica-Bold")
    .text(data.invoiceNumber, 150, customerInformationTop)
    .font("Helvetica")
    .text("Date of Invoice:", 50, customerInformationTop + 15)
    // If createdAt unix seconds is passed in, then use it else input will be undefined and will be today's date
    .text(
      formatDate(data.createdAt ? new Date(data.createdAt * 1000) : new Date()),
      150,
      customerInformationTop + 15
    )
    .text("Balance Due:", 50, customerInformationTop + 30)
    .text(
      formatCurrency(data.subtotal - data.paid),
      150,
      customerInformationTop + 30
    )
    // Unlike receipt, invoices always expect customer details since invoices are issued to specific people at specific billing addresses
    .font("Helvetica-Bold")
    .text(data.customer.name, 300, customerInformationTop)
    .font("Helvetica")
    .text(data.customer.address, 300, customerInformationTop + 15)
    .text(
      `${data.customer.country || "Singapore"}, ${data.customer.city || "SG"}`,
      300,
      customerInformationTop + 30
    );

  generateHr(doc);
  doc.moveDown(5);
}

function generateItemTable(doc, data) {
  doc.font("Helvetica-Bold");
  generateTableRow(
    doc,
    "Item",
    "Description",
    "Unit Cost",
    "Quantity",
    "Line Total"
  );
  generateHr(doc);
  doc.moveDown(2);

  doc.font("Helvetica");
  for (const item of data.items) {
    generateTableRow(
      doc,
      item.name,
      item.description,
      formatCurrency(item.price),
      item.quantity,
      formatCurrency(item.price * item.quantity)
    );

    generateHr(doc);
    doc.moveDown(2);
  }
  doc.moveDown();

  generateTableRow(doc, "", "", "Subtotal", "", formatCurrency(data.subtotal));
  doc.moveDown();

  generateTableRow(doc, "", "", "Paid To Date", "", formatCurrency(data.paid));
  doc.moveDown();

  doc.font("Helvetica-Bold");
  generateTableRow(
    doc,
    "",
    "",
    "Balance Due",
    "",
    formatCurrency(data.subtotal - data.paid)
  );
}

module.exports = create;
