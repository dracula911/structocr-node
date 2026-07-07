const axios = require('axios');
const fs = require('fs');
const path = require('path');

class StructOCR {
    /**
     * Initialize StructOCR Client
     * Get your API Key at: https://structocr.com
     * @param {string} apiKey - Your API Key
     * @param {string} baseURL - API Endpoint (Optional)
     */
    constructor(apiKey, baseURL = 'https://api.structocr.com/v1') {
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
                'User-Agent': 'StructOCR-Node/1.6.0'
            },

            timeout: 30000
        });
    }

    /**
     * Internal method to handle file reading and API request
     * @private
     */
    async _postImage(endpoint, filePath) {
        try {
            if (!fs.existsSync(filePath)) {
                throw new Error(`File not found: ${filePath}`);
            }

            const imageBuffer = fs.readFileSync(filePath);
            const base64Image = imageBuffer.toString('base64');

            const payload = {
                img: base64Image
            };


            const response = await this.client.post(`/${endpoint}`, payload);
            return response.data;

        } catch (error) {
            if (error.response) {
                throw new Error(`API Error: ${error.response.status} - ${JSON.stringify(error.response.data)}`);
            } else if (error.request) {
                throw new Error('Network Error: No response received from StructOCR API');
            } else {
                throw new Error(`Client Error: ${error.message}`);
            }
        }
    }

    // --- Public Methods ---

    /**
     * Scan a Passport image
     * @param {string} filePath - Path to the image file
     * @returns {Promise<object>} Structured JSON data
     */
    async scanPassport(filePath) {
        return this._postImage('passport', filePath);
    }

    /**
     * Scan a National ID Card
     * @param {string} filePath - Path to the image file
     * @returns {Promise<object>} Structured JSON data
     * @note In v1.5.0+, raw MRZ lines (if present) are accessible via `data.additional_fields`.
     */
    async scanNationalId(filePath) {
        return this._postImage('national-id', filePath);
    }

    /**
     * Scan a Driver License
     * @param {string} filePath - Path to the image file
     * @returns {Promise<object>} Structured JSON data
     */
    async scanDriverLicense(filePath) {
        return this._postImage('driver-license', filePath);
    }

    /**
     * Scan an Invoice 
     * @param {string} filePath - Path to the image file
     * @returns {Promise<object>} Structured JSON data
     */
    async scanInvoice(filePath) {
        // 'invoice'  https://api.structocr.com/v1/invoice
        return this._postImage('invoice', filePath);
    }

    /**
     * Scan a VIN code (Vehicle Identification Number)
     * @param {string} filePath - Path to the image file
     * @returns {Promise<object>} Structured JSON data
     */
    async scanVin(filePath) {
        return this._postImage('vin', filePath);
    }

    /**
     * Scan a Container code 
     * @param {string} filePath - Path to the image file
     * @returns {Promise<object>} Structured JSON data
     */
    async scanContainer(filePath) {
        return this._postImage('container', filePath);
    }

    /**
     * Scan a HIN code (Hull Identification Number)
     * @param {string} filePath - Path to the image file
     * @returns {Promise<object>} Structured JSON data
     */
    async scanHin(filePath) {
        return this._postImage('hin', filePath);
    }

    /**
     * Scan a Receipt 
     * @param {string} filePath - Path to the image file
     * @returns {Promise<object>} Structured JSON data
     */
    async scanReceipt(filePath) {
        return this._postImage('receipt', filePath);
    }

    /**
     * Scan a Vehicle License Plate (Optimized for Southeast Asia).
     * @param {string} filePath - Path to the local license plate image file.
     * @returns {Promise<Object>} - Structured JSON data including plate_number, region_text, etc.
     */
    async scanLicensePlate(filePath) {
        return this._postImage('license-plate', filePath);
    }
}

module.exports = StructOCR;