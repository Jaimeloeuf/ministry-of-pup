# MOP-Invoice
Library to generate invoices for MOP services


## Peer dependencies
These are the libraries/deps needed to be passed in when using this lib

### Always needed
pdfkit: ^0.9.0

### When using node to convert PDF stream to base64 string
base64-stream: ^1.0.0


## API / Usage
### Node with require, generate invoice PDF and write to file system
```javascript
const createInvoice = require("mop-invoice");

const fs = require("fs");
const PDFDocument = require("pdfkit");

createInvoice(PDFDocument, {
  invoiceNumber: 1,
  shipping: {
    name: "John Doe",
    address: "12 Amazing Condo",
    country: "Singapore",
    city: "SG",
    postal_code: 123456,
  },
  items: [
    // Note that all amount/currency is in cents
    {
      item: "French Bulldog",
      description: "3 month old French Bulldog",
      quantity: 1,
      amount: 1000000,
    },
    {
      item: "Dog house",
      description: "Free gift",
      quantity: 1,
      amount: 0,
    },
  ],
  subtotal: 1000000,
  paid: 1000000,
}).pipe(fs.createWriteStream("invoice.pdf"));
```


### Node with require, generate invoice base64 string to send via email
```javascript
const createInvoice = require("mop-invoice");

const fs = require("fs");
const PDFDocument = require("pdfkit");

const invoiceData = {
  invoiceNumber: 1,
  shipping: {
    name: "John Doe",
    address: "12 Amazing Condo",
    country: "Singapore",
    city: "SG",
    postal_code: 123456,
  },
  items: [
    // Note that all amount/currency is in cents
    {
      item: "French Bulldog",
      description: "3 month old French Bulldog",
      quantity: 1,
      amount: 1000000,
    },
    {
      item: "Dog house",
      description: "Free gift",
      quantity: 1,
      amount: 0,
    },
  ],
  subtotal: 1000000,
  paid: 1000000,
};

async function streamToString(doc) {
  const { Base64Encode } = require("base64-stream");

  let string = ""; // contains the base64 string
  let stream = doc.pipe(new Base64Encode());

  return new Promise((resolve, reject) => {
    stream.on("data", (chunk) => (string += chunk));
    stream.on("error", (err) => reject(err));
    stream.on("end", () => resolve(string));
  });
}

sendMail.send({
  to: "john@example.com",
  from: "invoice@ministryofpup.com",
  subject: "Ministry Of Pup: Invoice",
  attachments: [
    {
      content: await streamToString(createInvoice(PDFDocument, invoiceData)),
      filename: "Invoice.pdf",
      type: "application/pdf",
      disposition: "attachment",
    },
  ],
});
```


<!-- @todo -->
Browser with import, generate base 64 string
```javascript
import createInvoice from "mop-invoice";
import PDFDocument from "pdfkit";

createInvoice(PDFDocument, {
  invoiceNumber: 1,
  shipping: {
    name: "John Doe",
    address: "12 Amazing Condo",
    country: "Singapore",
    city: "SG",
    postal_code: 123456,
  },
  items: [
    // Note that all amount/currency is in cents
    {
      item: "French Bulldog",
      description: "3 month old French Bulldog",
      quantity: 1,
      amount: 1000000,
    },
    {
      item: "Dog house",
      description: "Free gift",
      quantity: 1,
      amount: 0,
    },
  ],
  subtotal: 1000000,
  paid: 1000000,
}).pipe(blob("invoice.pdf"));
```