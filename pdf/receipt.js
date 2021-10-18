const {
  generateHeader,
  generateFooter,
  generateTableRow,
  generateHr,
  formatCurrency,
  formatDate,
} = require("./commonUtils.js");

function create(PDFDocument, invoice) {
  const doc = new PDFDocument({ size: "A4", margin: 50 });

  generateHeader(doc);
  generateCustomerInformation(doc, invoice);
  generateInvoiceTable(doc, invoice);
  generateFooter(doc, "Thank you for your business!");

  doc.end();

  return doc;
}

// Invoice meta data and customer information
function generateCustomerInformation(doc, invoice) {
  doc.fillColor("#444444").fontSize(20).text("Sales Receipt", 50, 160);

  generateHr(doc, 185);

  const customerInformationTop = 200;

  doc
    .fontSize(10)
    .text("Receipt Number:", 50, customerInformationTop)
    .font("Helvetica-Bold")
    .text(invoice.receiptNumber, 140, customerInformationTop)
    .font("Helvetica")
    .text("Date of Sale:", 50, customerInformationTop + 15)
    // For now the date is always today's date
    .text(formatDate(new Date()), 140, customerInformationTop + 15)
    .font("Helvetica-Bold")
    .text(invoice.customer.name, 300, customerInformationTop)
    .font("Helvetica")
    .text(invoice.customer.address, 300, customerInformationTop + 15)
    .text(
      `${invoice.customer.country || "Singapore"}, ${
        invoice.customer.city || "SG"
      }`,
      300,
      customerInformationTop + 30
    )
    .moveDown();

  generateHr(doc, 252);
}

// Invoice data/content with the individual rows and stuff
function generateInvoiceTable(doc, invoice) {
  let i;
  const invoiceTableTop = 330;

  doc.font("Helvetica-Bold");
  generateTableRow(
    doc,
    invoiceTableTop,
    "Item",
    "Description",
    "Unit Cost",
    "Quantity",
    "Line Total"
  );
  generateHr(doc, invoiceTableTop + 20);
  doc.font("Helvetica");

  for (i = 0; i < invoice.items.length; i++) {
    const item = invoice.items[i];
    const position = invoiceTableTop + (i + 1) * 30;
    generateTableRow(
      doc,
      position,
      item.item,
      item.description,
      formatCurrency(item.amount),
      item.quantity,
      formatCurrency(item.amount * item.quantity)
    );

    generateHr(doc, position + 20);
  }

  const subtotalPosition = invoiceTableTop + (i + 1) * 30;
  generateTableRow(
    doc,
    subtotalPosition,
    "",
    "",
    "Subtotal",
    "",
    formatCurrency(invoice.totalPrice)
  );

  const paidToDatePosition = subtotalPosition + 20;
  generateTableRow(
    doc,
    paidToDatePosition,
    "",
    "",
    "Paid",
    "",
    formatCurrency(invoice.totalPrice)
  );
}

module.exports = create;
