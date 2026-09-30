# StructOCR Node.js SDK

Official Node.js client for the [StructOCR API](https://structocr.com/developers).

The SDK accepts a local JPG, PNG, WebP, or PDF path, plus an in-memory `Buffer` or `Uint8Array`. It validates the decoded file locally, converts it to Base64, and sends JSON as `{"img":"..."}`. The REST API also supports multipart uploads; this SDK release keeps Base64 JSON as its default transport for backward compatibility.

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

TypeScript declarations are included. See the [API documentation](https://structocr.com/developers) for endpoint-specific response schemas and error codes.

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
