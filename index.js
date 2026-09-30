const axios = require('axios');
const fs = require('fs');

const MAX_FILE_SIZE = Math.floor(4.5 * 1024 * 1024);
const SUPPORTED_FORMATS = 'JPG, PNG, WebP, and PDF';
const IMAGE_ONLY_FORMATS = 'JPG, PNG, and WebP';
const { version: SDK_VERSION } = require('./package.json');
const RETRYABLE_STATUS_CODES = new Set([429, 502, 503, 504]);

class StructOCRError extends Error {
    constructor(message, options = {}) {
        super(message, options.cause ? { cause: options.cause } : undefined);
        this.name = 'StructOCRError';
        this.status = options.status ?? null;
        this.code = options.code ?? null;
        this.details = options.details ?? null;
        this.retryable = options.retryable ?? false;
    }
}

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
                'User-Agent': `StructOCR-Node/${SDK_VERSION}`
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
    static _readFile(input, options = {}) {
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
        const mimeType = StructOCR._detectMime(content);
        if (!mimeType) {
            throw new Error(`Unsupported file format. Supported formats: ${SUPPORTED_FORMATS}`);
        }
        if (options.allowPdf === false && mimeType === 'application/pdf') {
            throw new Error(`Unsupported file format. Supported formats: ${IMAGE_ONLY_FORMATS}`);
        }
        return content;
    }

    /** @private */
    async _postImage(endpoint, input, params, options = {}) {
        try {
            const content = StructOCR._readFile(input, options);
            const body = { img: content.toString('base64') };
            const response = params
                ? await this.client.post(`/${endpoint}`, body, { params })
                : await this.client.post(`/${endpoint}`, body);
            return response.data;
        } catch (error) {
            throw StructOCR._normalizeError(error);
        }
    }

    /** @private */
    static _normalizeError(error) {
        if (error instanceof StructOCRError) return error;
        if (error.response) {
            const status = Number(error.response.status) || null;
            const details = error.response.data ?? null;
            const code = details && typeof details === 'object'
                ? (details.code || details.error || null)
                : null;
            const apiMessage = details && typeof details === 'object' ? details.message : null;
            return new StructOCRError(
                apiMessage || `API Error: ${status} - ${JSON.stringify(details)}`,
                {
                    status,
                    code,
                    details,
                    retryable: status !== null && RETRYABLE_STATUS_CODES.has(status),
                    cause: error
                }
            );
        }
        if (error.request) {
            return new StructOCRError('Network Error: No response received from StructOCR API', {
                code: 'NETWORK_ERROR',
                retryable: true,
                cause: error
            });
        }
        return new StructOCRError(`Client Error: ${error.message}`, {
            code: 'CLIENT_ERROR',
            cause: error
        });
    }

    async getAccountBalance() {
        try {
            const response = await this.client.get('/account/balance');
            return response.data;
        } catch (error) {
            throw StructOCR._normalizeError(error);
        }
    }

    async scanPassport(input) { return this._postImage('passport', input); }
    async scanNationalId(input) { return this._postImage('national-id', input); }
    async scanDriverLicense(input) { return this._postImage('driver-license', input); }
    async scanDriverLicensePdf417(input) {
        return this._postImage('driver-license-pdf417', input, undefined, { allowPdf: false });
    }
    async scanInvoice(input) { return this._postImage('invoice', input); }
    async scanVin(input) { return this._postImage('vin', input); }
    async scanContainer(input) { return this._postImage('container', input); }
    async scanHin(input) { return this._postImage('hin', input); }
    async scanReceipt(input, options = {}) {
        const responseVersion = options.responseVersion;
        const accuracy = options.accuracy ?? 'standard';
        if (responseVersion !== undefined && responseVersion !== 2) {
            throw new StructOCRError('responseVersion must be 2 when provided; Receipt v1 is retired', { code: 'INVALID_OPTIONS' });
        }
        if (!['standard', 'enhanced'].includes(accuracy)) {
            throw new StructOCRError('accuracy must be "standard" or "enhanced"', { code: 'INVALID_OPTIONS' });
        }
        if (accuracy === 'standard' && responseVersion === undefined) {
            return this._postImage('receipt', input);
        }
        const params = {};
        if (responseVersion === 2) params.response_version = 2;
        if (accuracy === 'enhanced') params.accuracy = 'enhanced';
        return this._postImage('receipt', input, params);
    }
    async scanLicensePlate(input) { return this._postImage('license-plate', input); }
    async scanVehicleRegistration(input) { return this._postImage('vehicle-registration', input); }
    async scanAtmCassette(input) { return this._postImage('atm-cassette', input); }
    async scanWeighbridgeTicket(input) { return this._postImage('weighbridge-ticket', input); }
}

StructOCR.StructOCRError = StructOCRError;
module.exports = StructOCR;
module.exports.StructOCRError = StructOCRError;
