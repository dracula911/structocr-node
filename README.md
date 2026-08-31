# StructOCR Node.js SDK

Official Node.js client for the [StructOCR API](https://structocr.com/developers).

The SDK accepts a local JPG, PNG, WebP, or PDF path, plus an in-memory `Buffer` or `Uint8Array`. It validates the decoded file locally, converts it to Base64, and sends the API's required JSON payload: `{"img":"..."}`. The REST API itself does not accept file paths, buffers, URLs, or multipart uploads.

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
scanInvoice(file)
scanReceipt(file)
scanVin(file)
scanHin(file)
scanContainer(file)
scanLicensePlate(file)
scanVehicleRegistration(file)
scanAtmCassette(file)
getAccountBalance()
```

All document methods accept a local path, Buffer, or Uint8Array. Supported decoded formats are JPG, PNG, WebP, and PDF, up to 4.5MB.

## Configuration

```js
const client = new StructOCR(
  'YOUR_API_KEY',
  'https://api.structocr.com/v1',
  60000,
);
```

TypeScript declarations are included. See the [API documentation](https://structocr.com/developers) for endpoint-specific response schemas and error codes.

## License

MIT
