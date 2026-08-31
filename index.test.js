const assert = require('node:assert/strict');
const fs = require('node:fs');
const os = require('node:os');
const path = require('node:path');
const test = require('node:test');

const StructOCR = require('./index');

const JPEG = Buffer.from([0xff, 0xd8, 0xff, 0xe0, 0x01]);
const PDF = Buffer.from('%PDF-1.7\ntest');

function makeClient() {
    return new StructOCR('test-key', 'https://example.test/v1');
}

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

    assert.deepEqual(endpoints, ['vehicle-registration', 'atm-cassette']);
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
