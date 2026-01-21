# StructOCR Node.js SDK

[![npm version](https://badge.fury.io/js/structocr.svg)](https://badge.fury.io/js/structocr)
[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)

**The official Node.js client for [StructOCR](https://structocr.com).**

StructOCR allows developers to extract structured data from identity documents with 99% accuracy. Integrate **Passport OCR**, **National ID OCR**, **Driver License OCR** and **Invoice OCR** into your Node.js or Electron applications.

👉 **[Get your Free API Key here](https://structocr.com)**

## Installation

Install via npm:

```bash
npm install structocr

```

## Quick Start

### 1. Initialize the Client

```javascript
const StructOCR = require('structocr');

// Initialize with your API Key
const client = new StructOCR('sk_live_xxxxxxxx');

```

### 2. Scan a Passport (Passport OCR)

Using `async/await`:

```javascript
(async () => {
  try {
    const result = await client.scanPassport('./passport_sample.jpg');
    
    console.log('Document Number:', result.data.document_number);
    console.log('Full Name:', result.data.name);
    
  } catch (error) {
    console.error('OCR Failed:', error.message);
  }
})();

```

### 3. Scan ID & Driver License & Invoice

```javascript
// Scan National ID
const idData = await client.scanNationalId('./id_card.png');

// Scan Driver License
const licenseData = await client.scanDriverLicense('./license.jpg');

// Scan Invoice
const invoiceData = await client.scanInvoice('./invoice.jpg');

```

## Features

* **Passport Parsing**: Extract MRZ, Name, DOB, Expiry Date.
* **ID Card OCR**: Automatic field mapping for National IDs.
* **Driver License**: Extract vehicle class and license numbers.
* **Invoice**: Extract invoice number, currency, merchant, customer.
* **Base64 Handling**: Automatically handles image encoding.

## Documentation

For full API documentation, please visit [StructOCR Docs](https://www.structocr.com/developers).

## License

MIT License.
