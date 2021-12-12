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
  generateFooter(
    doc,
    "Payment is due within 15 days. Thank you for your business."
  );

  doc.end();

  return doc;
}

// Invoice meta data and customer information
function generateCustomerInformation(doc, invoice) {
  doc.fillColor("#444444").fontSize(20).text("Invoice", 50, 160);

  generateHr(doc);

  const customerInformationTop = 200;

  doc
    .fontSize(10)
    .text("Invoice Number:", 50, customerInformationTop)
    .font("Helvetica-Bold")
    .text(invoice.invoiceNumber, 150, customerInformationTop)
    .font("Helvetica")
    .text("Date of Invoice:", 50, customerInformationTop + 15)
    // If createdAt unix seconds is passed in, then use it else input will be undefined and will be today's date
    .text(
      formatDate(
        invoice.createdAt ? new Date(invoice.createdAt * 1000) : new Date()
      ),
      150,
      customerInformationTop + 15
    )
    .text("Balance Due:", 50, customerInformationTop + 30)
    .text(
      formatCurrency(invoice.subtotal - invoice.paid),
      150,
      customerInformationTop + 30
    )

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

  generateHr(doc);
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
  generateHr(doc);
  doc.font("Helvetica");

  for (i = 0; i < invoice.items.length; i++) {
    const item = invoice.items[i];
    const position = invoiceTableTop + (i + 1) * 30;
    generateTableRow(
      doc,
      position,
      item.item,
      item.description,
      formatCurrency(item.price),
      item.quantity,
      formatCurrency(item.price * item.quantity)
    );

    generateHr(doc);
  }

  const subtotalPosition = invoiceTableTop + (i + 1) * 30;
  generateTableRow(
    doc,
    subtotalPosition,
    "",
    "",
    "Subtotal",
    "",
    formatCurrency(invoice.subtotal)
  );

  const paidToDatePosition = subtotalPosition + 20;
  generateTableRow(
    doc,
    paidToDatePosition,
    "",
    "",
    "Paid To Date",
    "",
    formatCurrency(invoice.paid)
  );

  const duePosition = paidToDatePosition + 25;
  doc.font("Helvetica-Bold");
  generateTableRow(
    doc,
    duePosition,
    "",
    "",
    "Balance Due",
    "",
    formatCurrency(invoice.subtotal - invoice.paid)
  );
  doc.font("Helvetica");
}

module.exports = create;
