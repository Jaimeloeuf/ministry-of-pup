# PDF
Library to generate PDFs for MOP services, such as receipts, invoices and sales agreements.


## Peer dependencies
These are the libraries/deps needed to be passed in when using this lib

### Always needed
pdfkit: ^13.0.0

### When using node to convert PDF stream to base64 string
base64-stream: ^1.0.0


## API / Usage
### Node with require, generate invoice base64 string to send via email
```javascript
// Generate PDF invoice and convert it to base64 string before returning
async function generateInvoiceString(invoiceData) {
  // Lazily import this to keep serverless container start up time fast as this is not always used
  // Can be globally imported too...
  const create = require("mop-invoice").receipt;
  const PDFDocument = require("pdfkit");
  const { Base64Encode } = require("base64-stream");

  let string = ""; // Contains the final base64 string after concatenation
  let stream = create(PDFDocument, invoiceData).pipe(new Base64Encode());

  return new Promise((resolve, reject) => {
    stream.on("data", (chunk) => (string += chunk));
    stream.on("error", (err) => reject(err));
    stream.on("end", () => resolve(string));
  });
}

const receipt = {
  receiptNumber: "MOP-2110-f83j",

  // Only required for receipt and not invoices
  paymentMethod: "Paynow",

  customer: {
    name: "John Doe",
    address: "12 Amazing Condo",
    country: "Singapore",
    city: "SG",
    postal_code: 123456,
  },
  items: [
    // Note that all price needs to be in cents
    {
      item: "French Bulldog",
      description: "3 month old French Bulldog",
      quantity: 1,
      price: 1000090,
    },
    {
      item: "Dog house",
      description: "1x1m dog house",
      quantity: 2,
      price: 20000,
    },
    {
      item: "Gift pack",
      description: "Free gift",
      quantity: 1,
      price: 0,
    },
  ],

  totalPrice: 1040090,
};

sendMail.send({
  to: "john@example.com",
  from: "invoice@ministryofpup.com",
  subject: "Ministry Of Pup: Invoice",
  attachments: [
    {
      content: await generateInvoiceString(invoiceData),
      filename: "Invoice.pdf",
      type: "application/pdf",
      disposition: "attachment",
    },
  ],
});
```


### Node with require, generate invoice PDF and write to file system
```javascript
const create = require("mop-invoice");

const fs = require("fs");
const PDFDocument = require("pdfkit");

create(PDFDocument, {
  invoiceNumber: 1,
  customer: {
    name: "John Doe",
    address: "12 Amazing Condo",
    country: "Singapore",
    city: "SG",
    postal_code: 123456,
  },
  items: [
    // Note that all price needs to be in cents
    {
      item: "French Bulldog",
      description: "3 month old French Bulldog",
      quantity: 1,
      price: 1000000,
    },
    {
      item: "Dog house",
      description: "Free gift",
      quantity: 1,
      price: 0,
    },
  ],
  subtotal: 1000000,
  paid: 1000000,
}).pipe(fs.createWriteStream("invoice.pdf"));
```


<!-- @todo -->
Browser with import, generate base 64 string
```javascript
import createInvoice from "mop-invoice";
import PDFDocument from "pdfkit";

createInvoice(PDFDocument, {
  invoiceNumber: 1,
  customer: {
    name: "John Doe",
    address: "12 Amazing Condo",
    country: "Singapore",
    city: "SG",
    postal_code: 123456,
  },
  items: [
    // Note that all price needs to be in cents
    {
      item: "French Bulldog",
      description: "3 month old French Bulldog",
      quantity: 1,
      price: 1000000,
    },
    {
      item: "Dog house",
      description: "Free gift",
      quantity: 1,
      price: 0,
    },
  ],
  subtotal: 1000000,
  paid: 1000000,
}).pipe(blob("invoice.pdf"));
```