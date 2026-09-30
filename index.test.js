const assert = require('node:assert/strict');
const fs = require('node:fs');
const os = require('node:os');
const path = require('node:path');
const test = require('node:test');

const StructOCR = require('./index');
const { version } = require('./package.json');

const JPEG = Buffer.from([0xff, 0xd8, 0xff, 0xe0, 0x01]);
const PDF = Buffer.from('%PDF-1.7\ntest');

function makeClient() {
    return new StructOCR('test-key', 'https://example.test/v1');
}

test('uses the package version in the User-Agent', () => {
    const client = makeClient();
    assert.equal(client.client.defaults.headers['User-Agent'], `StructOCR-Node/${version}`);
});

test('encodes a local file as Base64 JSON', async (t) => {
    const directory = fs.mkdtempSync(path.join(os.tmpdir(), 'structocr-node-'));
    const filePath = path.join(directory, 'passport.jpg');
    fs.writeFileSync(filePath, JPEG);
    t.after(() => fs.rmSync(directory, { recursive: true }));

    const client = makeClient();
    let request;
    client.client.post = async (url, payload) => {
        request = { url, payload };
        return { data: { success: true } };
    };

    const result = await client.scanPassport(filePath);

    assert.deepEqual(result, { success: true });
    assert.equal(request.url, '/passport');
    assert.equal(request.payload.img, JPEG.toString('base64'));
});

test('accepts Buffer and PDF while still sending Base64 JSON', async () => {
    const client = makeClient();
    let payload;
    client.client.post = async (_url, body) => {
        payload = body;
        return { data: { success: true } };
    };

    await client.scanInvoice(PDF);

    assert.deepEqual(Buffer.from(payload.img, 'base64'), PDF);
});

test('rejects unsupported decoded formats', async () => {
    const client = makeClient();
    await assert.rejects(client.scanPassport(Buffer.from('plain text')), /Unsupported file format/);
});

test('rejects files larger than decoded 4.5MB', async () => {
    const client = makeClient();
    const oversized = Buffer.concat([JPEG, Buffer.alloc(Math.floor(4.5 * 1024 * 1024))]);
    await assert.rejects(client.scanPassport(oversized), /4\.5MB/);
});

test('maps the new OCR methods to their API routes', async () => {
    const client = makeClient();
    const endpoints = [];
    client._postImage = async (endpoint) => {
        endpoints.push(endpoint);
        return { success: true };
    };

    await client.scanVehicleRegistration(JPEG);
    await client.scanAtmCassette(JPEG);
    await client.scanWeighbridgeTicket(JPEG);
    await client.scanDriverLicensePdf417(JPEG);

    assert.deepEqual(endpoints, ['vehicle-registration', 'atm-cassette', 'weighbridge-ticket', 'driver-license-pdf417']);
});

test('uses the Receipt v2 default and only sends enhanced accuracy', async () => {
    const client = makeClient();
    const requests = [];
    client.client.post = async (url, body, config) => {
        requests.push({ url, body, config });
        return { data: { success: true } };
    };

    await client.scanReceipt(JPEG);
    await client.scanReceipt(JPEG, { accuracy: 'enhanced' });
    await client.scanReceipt(JPEG, { responseVersion: 2 });

    assert.equal(requests[0].url, '/receipt');
    assert.equal(requests[0].config, undefined);
    assert.deepEqual(requests[1].config.params, { accuracy: 'enhanced' });
    assert.deepEqual(requests[2].config.params, { response_version: 2 });
});

test('rejects invalid receipt options before making a request', async () => {
    const client = makeClient();
    client.client.post = async () => assert.fail('request should not be sent');

    await assert.rejects(
        client.scanReceipt(JPEG, { responseVersion: 1 }),
        error => error instanceof StructOCR.StructOCRError && error.code === 'INVALID_OPTIONS'
    );
});

test('rejects PDF input for the image-only PDF417 endpoint', async () => {
    const client = makeClient();
    client.client.post = async () => assert.fail('request should not be sent');
    await assert.rejects(client.scanDriverLicensePdf417(PDF), /JPG, PNG, and WebP/);
});

test('exposes structured API errors without enabling automatic retries', async () => {
    const client = makeClient();
    client.client.post = async () => {
        const error = new Error('request failed');
        error.response = {
            status: 503,
            data: { success: false, code: 'SYSTEM_BUSY', message: 'Please try again later.' }
        };
        throw error;
    };

    await assert.rejects(client.scanPassport(JPEG), error => {
        assert.ok(error instanceof StructOCR.StructOCRError);
        assert.equal(error.status, 503);
        assert.equal(error.code, 'SYSTEM_BUSY');
        assert.equal(error.retryable, true);
        assert.deepEqual(error.details, {
            success: false,
            code: 'SYSTEM_BUSY',
            message: 'Please try again later.'
        });
        return true;
    });
});

test('gets account balance without a request body', async () => {
    const client = makeClient();
    let requestedUrl;
    client.client.get = async (url) => {
        requestedUrl = url;
        return { data: { account: { credits_remaining: 200 } } };
    };

    const result = await client.getAccountBalance();

    assert.equal(requestedUrl, '/account/balance');
    assert.equal(result.account.credits_remaining, 200);
});
