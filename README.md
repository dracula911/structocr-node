# StructOCR Node.js SDK

Official Node.js client for the [StructOCR API](https://structocr.com/developers?utm_source=npm&utm_medium=readme&utm_campaign=sdk).

Extract validated, structured JSON from 19 document types — spanning identity & KYC (passports, travel visas, proof of address, national IDs, driver licenses, PDF417 barcodes, health insurance cards), vehicles & insurance (VIN, VIN Pro vehicle decode, license plates, registrations, auto insurance cards), finance (invoices, receipts), and logistics (bills of lading, shipping containers, weighbridge tickets, ATM cassettes, boat HINs). One method call per document, zero template training.

The SDK accepts a local JPG, PNG, WebP, or PDF path, plus an in-memory `Buffer` or `Uint8Array`. It validates the decoded file locally, converts it to Base64, and sends JSON as `{"img":"..."}`. The REST API also supports multipart uploads; this SDK release keeps Base64 JSON as its default transport for backward compatibility.

## Get a free API key

1. [Create an account](https://structocr.com/register?utm_source=npm&utm_medium=readme&utm_campaign=sdk). New accounts get **200 free credits**, enough for 100 two-credit document scans, and no credit card is needed.
2. Copy your key from **API Keys** in the dashboard.
3. Optionally test any of the 19 endpoints on a sample image in the [Playground](https://structocr.com/dashboard/playground?utm_source=npm&utm_medium=readme&utm_campaign=sdk) before you write code.

Not ready to sign up? Try documents directly in your browser on a sample image or your own file, no account needed: use the **Try it** links in the table below.

After the free credits, packs start at $5 for 500 credits. There is no subscription and credits do not expire. See [pricing](https://structocr.com/pricing?utm_source=npm&utm_medium=readme&utm_campaign=sdk).

## Supported documents

| Document | Method | Credits per scan | Try it |
| --- | --- | --- | --- |
| Passport | `scanPassport` | 2 | [Try it](https://structocr.com/products/passport-ocr?utm_source=npm&utm_medium=readme&utm_campaign=sdk_try#live-demo) |
| Driver license (front) | `scanDriverLicense` | 2 | [Try it](https://structocr.com/products/driver-license-ocr?utm_source=npm&utm_medium=readme&utm_campaign=sdk_try#live-demo) |
| US/Canada driver license PDF417 barcode | `scanDriverLicensePdf417` | 2 | [Try it](https://structocr.com/tools/driver-license-pdf417-scanner?utm_source=npm&utm_medium=readme&utm_campaign=sdk_try) |
| National ID card | `scanNationalId` | 2 | [Try it](https://structocr.com/products/national-id-ocr?utm_source=npm&utm_medium=readme&utm_campaign=sdk_try#live-demo) |
| Health insurance card *(New)* | `scanHealthCard` | 2 | [Try it](https://structocr.com/products/health-card-ocr?utm_source=npm&utm_medium=readme&utm_campaign=sdk_try#live-demo) |
| Proof of Address *(New)* | `scanProofOfAddress` | 2 | [Try it](https://structocr.com/products/proof-of-address-ocr?utm_source=npm&utm_medium=readme&utm_campaign=sdk_try#live-demo) |
| Travel visa (MRV-A/B & eVisa) *(New)* | `scanVisa` | 2 | [Try it](https://structocr.com/products/visa-ocr?utm_source=npm&utm_medium=readme&utm_campaign=sdk_try#live-demo) |
| VIN | `scanVin` | 1 | [Try it](https://structocr.com/products/vin-ocr?utm_source=npm&utm_medium=readme&utm_campaign=sdk_try#live-demo) |
| VIN Pro (VIN + vehicle details) *(New)* | `scanVinPro` | 2 | |
| License plate | `scanLicensePlate` | 1 | [Try it](https://structocr.com/products/license-plate-ocr?utm_source=npm&utm_medium=readme&utm_campaign=sdk_try#live-demo) |
| Vehicle registration | `scanVehicleRegistration` | 2 | [Try it](https://structocr.com/products/vehicle-registration-ocr?utm_source=npm&utm_medium=readme&utm_campaign=sdk_try#live-demo) |
| Auto insurance card *(New)* | `scanAutoInsurance` | 2 | [Try it](https://structocr.com/products/auto-insurance-ocr?utm_source=npm&utm_medium=readme&utm_campaign=sdk_try#live-demo) |
| Invoice | `scanInvoice` | 3 | [Try it](https://structocr.com/products/invoice-ocr?utm_source=npm&utm_medium=readme&utm_campaign=sdk_try#live-demo) |
| Receipt | `scanReceipt` | 1 | [Try it](https://structocr.com/products/receipt-ocr?utm_source=npm&utm_medium=readme&utm_campaign=sdk_try#live-demo) |
| Shipping container (ISO 6346) | `scanContainer` | 1 | [Try it](https://structocr.com/products/container-ocr?utm_source=npm&utm_medium=readme&utm_campaign=sdk_try#live-demo) |
| Bill of Lading & freight *(New)* | `scanBillOfLading` | 3 | [Try it](https://structocr.com/products/bill-of-lading-ocr?utm_source=npm&utm_medium=readme&utm_campaign=sdk_try#live-demo) |
| Weighbridge ticket | `scanWeighbridgeTicket` | 2 | [Try it](https://structocr.com/products/weighbridge-ticket-ocr?utm_source=npm&utm_medium=readme&utm_campaign=sdk_try#live-demo) |
| ATM cassette | `scanAtmCassette` | 1 | |
| HIN (boat hull number) | `scanHin` | 1 | [Try it](https://structocr.com/products/hin-ocr?utm_source=npm&utm_medium=readme&utm_campaign=sdk_try#live-demo) |

The receipt endpoint's optional enhanced mode costs 2 credits. Only successful requests are charged.

## What's new in v1.10.0

Added native SDK methods and TypeScript definitions for all six newly launched StructOCR endpoints:

- **`scanProofOfAddress(file)`** (`POST /v1/proof-of-address`, 2 credits) — Utility bills, bank statements, tax notices, and leases with 90/180-day freshness and PO Box checks.
- **`scanVisa(file)`** (`POST /v1/visa`, 2 credits) — Passport visa stickers (ICAO 9303 MRV-A 2×44 & MRV-B 2×36 check-digit verification) and global eVisa PDFs.
- **`scanBillOfLading(file)`** (`POST /v1/bill-of-lading`, 3 credits) — Ocean/road Bills of Lading, Packing Lists, Air Waybills (IATA Mod-7 validation), Commercial Invoices, and signed PODs with ISO 6346 container checks and cargo weight reconciliation.
- **`scanHealthCard(file)`** (`POST /v1/health-card`, 2 credits) — US health insurance cards (Member ID, Group, RxBIN/RxPCN/RxGRP, copays), GCC/Canada/India/Brazil medical cards, and EU Tessera Sanitaria/EHIC, including 2-page front+back PDFs.
- **`scanAutoInsurance(file)`** (`POST /v1/auto-insurance`, 2 credits) — US ACORD 50 / state proof of insurance and Canadian Pink Cards with NAIC, policy date, and VIN check-digit validation.
- **`scanVinPro(file)`** (`POST /v1/vin-pro`, 2 credits) — VIN OCR with ISO 3779 check-digit validation plus decoded vehicle year, make, model, trim, engine, and body class.

## Install

```bash
npm install structocr
```

Node.js 18+ is required.

## Quick start

```bash
export STRUCTOCR_API_KEY="YOUR_API_KEY"
```

```js
const StructOCR = require('structocr');

const client = new StructOCR();
const result = await client.scanPassport('./passport.jpg');

if (result.success) {
  console.log(result.data.passport_number);
  console.log(result.data.given_names, result.data.surname);
}
```

A passport scan returns JSON like this (fictional sample document):

```json
{
  "success": true,
  "data": {
    "type": "passport",
    "country_code": "UTO",
    "nationality": "UTOPIAN",
    "passport_number": "X4R7T2K9P",
    "surname": "MORGAN",
    "given_names": "OLIVIA ROSE",
    "sex": "F",
    "date_of_birth": "1990-03-14",
    "place_of_birth": "ZENITH CITY",
    "date_of_issue": "2024-07-16",
    "date_of_expiry": "2034-07-15",
    "place_of_issue": null
  }
}
```

PDF paths work the same way:

```js
const result = await client.scanInvoice('./invoice.pdf');
```

Express and other server frameworks can pass an uploaded Buffer without writing a temporary file:

```js
const result = await client.scanPassport(req.file.buffer);
```

The SDK converts the Buffer to Base64 locally. StructOCR's REST API still receives `application/json` with an `img` string.

## Methods

```text
scanPassport(file)
scanNationalId(file)
scanDriverLicense(file)
scanDriverLicensePdf417(file)
scanHealthCard(file)
scanProofOfAddress(file)
scanVisa(file)
scanVin(file)
scanVinPro(file)
scanLicensePlate(file)
scanVehicleRegistration(file)
scanAutoInsurance(file)
scanInvoice(file)
scanReceipt(file)
scanContainer(file)
scanBillOfLading(file)
scanWeighbridgeTicket(file)
scanAtmCassette(file)
scanHin(file)
getAccountBalance()
```

All document methods accept a local path, Buffer, or Uint8Array, up to 4.5MB. Most methods support JPG, PNG, WebP, and PDF. `scanDriverLicensePdf417` accepts JPG, PNG, and WebP only.

The Receipt endpoint returns v2 by default. Enhanced accuracy costs 2 credits instead of the standard 1 credit and is enabled with the `accuracy` option:

```js
const receipt = await client.scanReceipt('./receipt.jpg', {
  accuracy: 'enhanced'
});
```

`responseVersion: 2` remains accepted for compatibility but is not required. Receipt v1 is retired.

Proof of Address example:

```js
const poa = await client.scanProofOfAddress('./utility-bill.pdf');
if (poa.success) {
  console.log(poa.data.address, poa.data.validation.is_within_90_days);
}
```

Travel Visa example:

```js
const visa = await client.scanVisa('./visa-sticker.jpg');
if (visa.success) {
  console.log(visa.data.visa_number, visa.data.validation.mrz_checksum_valid);
}
```

Bill of Lading & freight example:

```js
const bol = await client.scanBillOfLading('./bill-of-lading.pdf');
if (bol.success) {
  console.log(bol.data.document_type, bol.data.containers, bol.data.validation);
}
```

US driver license PDF417 example:

```js
const result = await client.scanDriverLicensePdf417('./license-back.jpg');
if (result.success) {
  console.log(result.data.document_number);
}
```

Weighbridge ticket example:

```js
const result = await client.scanWeighbridgeTicket('./weighbridge-ticket.jpg');
if (result.success) {
  console.log(result.data.weights);
  console.log(result.data.validation);
}
```

## Configuration

```js
const client = new StructOCR(
  'YOUR_API_KEY',
  'https://api.structocr.com/v1',
  60000,
);
```

TypeScript declarations are included. See the [API documentation](https://structocr.com/developers?utm_source=npm&utm_medium=readme&utm_campaign=sdk) for endpoint-specific response schemas and error codes.

## Errors

API, network, and client failures are exposed as `StructOCR.StructOCRError`. Existing `catch (error)` code continues to work because it extends the standard `Error` class.

```js
try {
  await client.scanPassport('./passport.jpg');
} catch (error) {
  if (error instanceof StructOCR.StructOCRError) {
    console.error(error.status, error.code, error.retryable);
  }
}
```

`retryable` is advisory only. The SDK does not automatically retry OCR requests because doing so without an idempotency key could charge a request twice.

## License

MIT
