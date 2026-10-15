# StructOCR Node.js SDK

Official Node.js client for the [StructOCR API](https://structocr.com/developers?utm_source=npm&utm_medium=readme&utm_campaign=sdk).

Send a photo or PDF of a passport, ID card, driver license, VIN, invoice, receipt or shipping container and get structured JSON back: one method call per document, no templates to train.

The SDK accepts a local JPG, PNG, WebP, or PDF path, plus an in-memory `Buffer` or `Uint8Array`. It validates the decoded file locally, converts it to Base64, and sends JSON as `{"img":"..."}`. The REST API also supports multipart uploads; this SDK release keeps Base64 JSON as its default transport for backward compatibility.

## Get a free API key

1. [Create an account](https://structocr.com/register?utm_source=npm&utm_medium=readme&utm_campaign=sdk). New accounts get **200 free credits**, enough for 100 passport or driver license scans, and no credit card is needed.
2. Copy your key from **API Keys** in the dashboard.
3. Optionally try any document type on a sample image in the [Playground](https://structocr.com/dashboard/playground?utm_source=npm&utm_medium=readme&utm_campaign=sdk) before you write code.

After the free credits, packs start at $5 for 500 credits. There is no subscription and credits do not expire. See [pricing](https://structocr.com/pricing?utm_source=npm&utm_medium=readme&utm_campaign=sdk).

## Supported documents

| Document | Method | Credits per scan |
| --- | --- | --- |
| Passport | `scanPassport` | 2 |
| National ID card | `scanNationalId` | 2 |
| Driver license (front) | `scanDriverLicense` | 2 |
| US/Canada driver license PDF417 barcode | `scanDriverLicensePdf417` | 2 |
| Vehicle registration | `scanVehicleRegistration` | 2 |
| VIN | `scanVin` | 1 |
| License plate | `scanLicensePlate` | 1 |
| Invoice | `scanInvoice` | 3 |
| Receipt | `scanReceipt` | 1 |
| Shipping container (ISO 6346) | `scanContainer` | 1 |
| Weighbridge ticket | `scanWeighbridgeTicket` | 2 |
| ATM cassette | `scanAtmCassette` | 1 |
| HIN (boat hull number) | `scanHin` | 1 |

The receipt endpoint's optional enhanced mode costs 2 credits. Only successful requests are charged.

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
scanInvoice(file)
scanReceipt(file)
scanVin(file)
scanHin(file)
scanContainer(file)
scanLicensePlate(file)
scanVehicleRegistration(file)
scanAtmCassette(file)
scanWeighbridgeTicket(file)
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
