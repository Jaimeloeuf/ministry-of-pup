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
  generateFooter(doc, "Thank you for your business!");

  doc.end();

  return doc;
}

function generateReceiptAndCustomerTable(doc, data) {
  doc.fillColor("#444444").fontSize(20).text("Sales Receipt", 50, 160);
  generateHr(doc);

  const customerInformationTop = 200;

  doc
    .fontSize(10)
    .text("Receipt Number:", 50, customerInformationTop)
    .font("Helvetica-Bold")
    .text(data.receiptNumber, 140, customerInformationTop)
    .font("Helvetica")
    .text("Date of Sale:", 50, customerInformationTop + 15)
    // If createdAt unix seconds is passed in, then use it else input will be undefined and will be today's date
    .text(
      formatDate(data.createdAt ? new Date(data.createdAt * 1000) : new Date()),
      140,
      customerInformationTop + 15
    );

  // Only add customer information if it is available
  // Because not all receipts require customer information,
  // e.g. sale of a small item should not require user to create an account with us
  if (data.customer) {
    doc
      .font("Helvetica-Bold")
      .text(data.customer.name, 300, customerInformationTop);

    // Only add address if available, since some customer may only provide name and no address
    if (data.customer.address)
      doc
        .font("Helvetica")
        .text(data.customer.address, 300, customerInformationTop + 15)
        .text(
          `${data.customer.country || "Singapore"}, ${
            data.customer.city || "SG"
          }`,
          300,
          customerInformationTop + 30
        );
    // Move down a line to skip the address line and so that HR line can be properly generated
    else doc.moveDown();
  }

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

  generateTableRow(
    doc,
    "",
    "",
    "Subtotal",
    "",
    formatCurrency(data.totalPrice)
  );
  doc.moveDown();

  generateTableRow(doc, "", "", "Paid", "", formatCurrency(data.totalPrice));
  doc.moveDown();

  generateTableRow(doc, "", "", "Payment Method", "", data.paymentMethod);
}

module.exports = create;
