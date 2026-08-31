const axios = require('axios');
const fs = require('fs');

const MAX_FILE_SIZE = Math.floor(4.5 * 1024 * 1024);
const SUPPORTED_FORMATS = 'JPG, PNG, WebP, and PDF';

class StructOCR {
    /**
     * @param {string} [apiKey] StructOCR API key. Defaults to STRUCTOCR_API_KEY.
     * @param {string} [baseURL] API base URL.
     * @param {number} [timeout] Request timeout in milliseconds.
     */
    constructor(apiKey, baseURL = 'https://api.structocr.com/v1', timeout = 30000) {
        this.apiKey = apiKey || process.env.STRUCTOCR_API_KEY;
        if (!this.apiKey) {
            throw new Error('API Key is required. Get one at https://structocr.com');
        }

        this.baseURL = baseURL.replace(/\/$/, '');
        this.client = axios.create({
            baseURL: this.baseURL,
            headers: {
                'x-api-key': this.apiKey,
                'Content-Type': 'application/json',
                'User-Agent': 'StructOCR-Node/1.7.0'
            },
            timeout
        });
    }

    /** @private */
    static _detectMime(content) {
        if (content.length >= 4 && content.subarray(0, 4).equals(Buffer.from('%PDF'))) {
            return 'application/pdf';
        }
        if (content.length >= 3 && content[0] === 0xff && content[1] === 0xd8 && content[2] === 0xff) {
            return 'image/jpeg';
        }
        if (content.length >= 8 && content.subarray(0, 8).equals(Buffer.from([0x89, 0x50, 0x4e, 0x47, 0x0d, 0x0a, 0x1a, 0x0a]))) {
            return 'image/png';
        }
        if (
            content.length >= 12 &&
            content.subarray(0, 4).toString('ascii') === 'RIFF' &&
            content.subarray(8, 12).toString('ascii') === 'WEBP'
        ) {
            return 'image/webp';
        }
        return null;
    }

    /** @private */
    static _readFile(input) {
        let content;
        if (Buffer.isBuffer(input)) {
            content = input;
        } else if (input instanceof Uint8Array) {
            content = Buffer.from(input.buffer, input.byteOffset, input.byteLength);
        } else if (typeof input === 'string') {
            if (!fs.existsSync(input) || !fs.statSync(input).isFile()) {
                throw new Error(`File not found: ${input}`);
            }
            content = fs.readFileSync(input);
        } else {
            throw new TypeError('Input must be a local file path, Buffer, or Uint8Array');
        }

        if (content.length === 0) {
            throw new Error('File is empty');
        }
        if (content.length > MAX_FILE_SIZE) {
            throw new Error('File exceeds the maximum allowed size of 4.5MB');
        }
        if (!StructOCR._detectMime(content)) {
            throw new Error(`Unsupported file format. Supported formats: ${SUPPORTED_FORMATS}`);
        }
        return content;
    }

    /** @private */
    async _postImage(endpoint, input) {
        try {
            const content = StructOCR._readFile(input);
            const response = await this.client.post(`/${endpoint}`, {
                img: content.toString('base64')
            });
            return response.data;
        } catch (error) {
            if (error.response) {
                throw new Error(`API Error: ${error.response.status} - ${JSON.stringify(error.response.data)}`);
            }
            if (error.request) {
                throw new Error('Network Error: No response received from StructOCR API');
            }
            throw new Error(`Client Error: ${error.message}`);
        }
    }

    async getAccountBalance() {
        try {
            const response = await this.client.get('/account/balance');
            return response.data;
        } catch (error) {
            if (error.response) {
                throw new Error(`API Error: ${error.response.status} - ${JSON.stringify(error.response.data)}`);
            }
            if (error.request) {
                throw new Error('Network Error: No response received from StructOCR API');
            }
            throw new Error(`Client Error: ${error.message}`);
        }
    }

    async scanPassport(input) { return this._postImage('passport', input); }
    async scanNationalId(input) { return this._postImage('national-id', input); }
    async scanDriverLicense(input) { return this._postImage('driver-license', input); }
    async scanInvoice(input) { return this._postImage('invoice', input); }
    async scanVin(input) { return this._postImage('vin', input); }
    async scanContainer(input) { return this._postImage('container', input); }
    async scanHin(input) { return this._postImage('hin', input); }
    async scanReceipt(input) { return this._postImage('receipt', input); }
    async scanLicensePlate(input) { return this._postImage('license-plate', input); }
    async scanVehicleRegistration(input) { return this._postImage('vehicle-registration', input); }
    async scanAtmCassette(input) { return this._postImage('atm-cassette', input); }
}

module.exports = StructOCR;
