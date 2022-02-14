const {
  generateHeader,
  generateFooter,
  generateHr,
  formatCurrency,
  formatDate,
} = require("./commonUtils.js");

function create(PDFDocument, data) {
  const doc = new PDFDocument({ size: "A4", margin: 50 });

  generateHeader(doc);
  generateReceiptAndCustomerTable(doc, data);
  generateAgreement(doc, data);
  addSignature(doc, data);
  generateFooter(doc, "Thank you for your business!");

  doc.end();

  return doc;
}

function generateReceiptAndCustomerTable(doc, data) {
  doc.fontSize(22).text("Sales Agreement", 50, 140);
  generateHr(doc);

  const customerInformationTop = 180;

  doc
    .fontSize(10)
    .font("Helvetica")
    .text("Date of Sale:", 50, customerInformationTop)
    // If createdAt unix seconds is passed in, then use it else input will be undefined and will be today's date
    .text(
      formatDate(data.createdAt ? new Date(data.createdAt * 1000) : new Date()),
      120,
      customerInformationTop
    );

  doc
    .font("Helvetica-Bold")
    .text(data.customer.name, 300, customerInformationTop);

  // All dog sales require the customer address so no check is needed here
  doc
    .font("Helvetica")
    .text(data.customer.address, 300, customerInformationTop + 15)
    .text(
      `${data.customer.country || "Singapore"}, ${data.customer.city || "SG"}`,
      300,
      customerInformationTop + 30
    );

  generateHr(doc);
  doc.moveDown(4);
}

/** Add a table key and value on the same row */
function addRow(doc, key, value) {
  const { y } = doc;

  const x1 = doc.x;
  const x2 = doc.x + 140;

  doc
    /* Insert the key and value of that row on the same Y but at 2 different x points */
    .text(key, x1, y)
    .text(value, x2, y)

    /* Draw a line under each row */
    .moveTo(50, doc.y)
    .lineTo(doc.page.width - 50, doc.y)
    .stroke()

    /* Add a new line after each row */
    .moveDown()

    /* Reset the X position so that the next row will be flush to the left margin */
    .text("", 50, doc.y);
}

function generateAgreement(doc, data) {
  doc
    /* Set the alignment first */
    .text("", 50, doc.y)

    /* Contract Parties Section */
    .fontSize(17)
    .text("Contract Parties", 50, doc.y)
    .moveDown()
    .fontSize(13)
    .text(
      `The Contract is entered into between the Seller, Ministry of Pup LLP and the Buyer, ${data.customer.name}, NRIC, ${data.customer.ic}, in respect of the purchase of the following pet as indicated below, on the terms and conditions stated in this Contract.`
    )
    .moveDown(3)

    /* Livestock Details Section */
    .fontSize(17)
    .text("Livestock Details")
    .moveDown()
    .fontSize(13);

  // Add the dog details row by row
  addRow(doc, "Microchip number", data.dog.mcnumber);
  addRow(doc, "Breed", data.dog.breed);
  addRow(doc, "Sex", data.dog.sex);
  addRow(doc, "Date of Birth", data.dog.dob);
  addRow(doc, "Purchase Price", formatCurrency(data.salePrice));
  addRow(doc, "Deposit", formatCurrency(data.depositAmount));
  addRow(doc, "Pedigree", data.dog.pedigree);
  addRow(doc, "HDB Approved", data.dog.hdb);
  addRow(doc, "Country of Import", data.dog.country);

  /* Terms and Conditions Section, add page to start on the second page */
  doc
    .addPage()
    .fontSize(17)
    .text("Conditions of Sale")
    .moveDown()
    .fontSize(11)
    .list(
      [
        "Deposits for booking/ purchase of any Dog shall be non-refundable in the case when buyer changes his mind on the purchase.",
        "The Dog shall remain in the care and ownership of the Seller until the Buyer makes full payment of the purchase price on the collection date.",
        "The Seller guarantees that the purchased Dog will not have any life-threatening defects(congenital) for a duration of 7 days starting on the date of this contract. The seller makes no warranty, representation, guarantee, or promise that the Dog is healthy, free of disease or illness or otherwise fit for purpose.",
        "To substantiate and submit claim for guarantee under point 3, a complete Vet Report must be produced in 72 hours of receipt from the Buyer's veterinarian. The vet has to state the diagnosis and the likely cause (whether congenital or genetic) relating to the life-threatening defect(s). The Buyers shall bear the cost of obtaining the Vet Report.",
        "Upon receipt of Vet Report and assessed by the Seller that the life-threatening defect is congenital, the seller has the rights to either (i) refund only the purchased price upon the return of the Dog; (ii) exchange for another dog of same different breed or top up price difference for other breeds. In such event, the Buyer shall bear all reasonable shipping expenses for the replacement puppy.",
        "This guarantee of Life-threatening defects shall not be enforceable if there is a change of ownership or when the Dog is sold to another person.",
        "The Seller does not guarantee the color coat of the Dog as the assessment is based on Seller's best ability using the Dog parents' genetic attributes and their color coat at the point of purchase. The sale of pet shall not be invalidated by reason of any misdescription of the Dog and no compensation shall be payable by the seller.",
        "The Seller is only responsible for life-threatening defects within the guarantee period as stated above, the Seller shall not responsible for any other defects in relation to the Dog.",
        "The Buyer shall in the event of any dispute ('Dispute') arising out of this agreement, or any information in relation to the Dispute shall not be disclosed to any third party.",
        "In the event the Buyer dispose of or sell the above-described Dog for any reason, Buyer must notify Seller who will have first option of refusal.",
        "The Buyer represents that he shall not use the Dog for breeding purposes.",
        "No other warranties or guarantees, expressed or implied, are made under this contract except as stated above.",
      ],
      { listType: "numbered", paragraphGap: 10, textIndent: 30 }
    )
    .moveDown();
}

function addSignature(doc, data) {
  // Store width and height so that both the signature image and its border can share the same values
  // These numbers are derived by halving the canvas dimension of signature pad on admin portal, canvas is 320 by 130
  const width = 160;
  const height = 65;

  // Store current y value so that both the signature image and its border can share the same height,
  // Since the border is supposed to go over the image
  const { y } = doc;
  // For x, x is the starting point of painting, so to right align it, take width of page minus image width and 50 for page margin
  const x = doc.page.width - width - 50;

  doc
    .image(data.signatureDataURI, x, y, {
      width,
      height,
    })
    // Give the signature image a black border
    .rect(x, y, width, height)
    .stroke()
    .moveDown()
    .fontSize(14)
    .text("Buyer's Signature", x, doc.y);
}

module.exports = create;
