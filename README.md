[![npm version](https://badge.fury.io/js/structocr.svg)](https://badge.fury.io/js/structocr)
[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)

---

## 🚀 What's New in v1.5.0
We've massively upgraded our Identity Verification engine! 
* **Hybrid VIZ + MRZ AI for National IDs**: The SDK now automatically cross-validates unstructured Visual Zone (VIZ) data against cryptographic Machine Readable Zone (MRZ) checksums (TD1/TD2) for zero hallucination. Raw MRZ lines are now accessible via `additional_fields`.
* **Previous updates**: Added support for Receipt OCR, HIN OCR, VIN, and Shipping Containers.

* Check out the [Quick Start](#3-scan-other-document-types) below to see how to use them!

---

**The official Node.js client for [StructOCR](https://structocr.com).**

StructOCR allows developers to extract structured data from identity documents and industry codes with 99% accuracy. Integrate **Passport OCR**, **National ID OCR**, **Driver License OCR**, **Invoice OCR**, **Receipt OCR**, **VIN OCR**, **HIN OCR**, and **Container OCR** into your Node.js or Electron applications.

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

### 3. Scan Other Document Types

```javascript
// Scan National ID
const idData = await client.scanNationalId('./id_card.png');

// Scan Driver License
const licenseData = await client.scanDriverLicense('./license.jpg');

// Scan Invoice
const invoiceData = await client.scanInvoice('./invoice.jpg');

// Scan Receipt (New in v1.4.0)
const receiptData = await client.scanReceipt('./receipt.jpg');

// Scan VIN
const vinData = await client.scanVin('./vin.jpg');

// Scan HIN (New in v1.4.0)
const hinData = await client.scanHin('./hin.jpg');

// Scan Container
const containerData = await client.scanContainer('./container.jpg');
```

## Features

* **Passport Parsing**: Extract MRZ, Name, DOB, Expiry Date.
* **National ID OCR**: Extract regional specific fields (CNP, CPF, NIN) and raw ICAO 9303 MRZ lines with Hybrid Validation.
* **Driver License**: Extract vehicle class and license numbers.
* **Invoice**: Extract invoice number, currency, merchant, customer.
* **Receipt**: Extract merchant details, timestamps, and total amounts from thermal receipts.
* **VIN OCR**: Extract Vehicle Identification Number from car chassis or windshield.
* **HIN OCR**: Extract Hull Identification Numbers accurately from marine vessels.
* **Container OCR**: Extract shipping container numbers accurately from images.
* **Base64 Handling**: Automatically handles image encoding.

## Documentation

For full API documentation, please visit [StructOCR Docs](https://www.structocr.com/developers).

## License

MIT License.