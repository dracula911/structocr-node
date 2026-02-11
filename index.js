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

        // 去除末尾的斜杠，防止拼接 URL 出错
        this.baseURL = baseURL.replace(/\/$/, '');

        // 初始化 Axios 实例
        this.client = axios.create({
            baseURL: this.baseURL,
            headers: {
                'x-api-key': this.apiKey,
                'Content-Type': 'application/json',
                'User-Agent': 'StructOCR-Node/1.1.0'
            },
            // 增加超时设置，OCR有时候需要几秒钟
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

            // 1. 读取文件并转换为 Base64
            const imageBuffer = fs.readFileSync(filePath);
            const base64Image = imageBuffer.toString('base64');

            // 2. 构造 JSON Payload
            const payload = {
                img: base64Image
            };

            // 3. 发送请求
            const response = await this.client.post(`/${endpoint}`, payload);
            return response.data;

        } catch (error) {
            if (error.response) {
                // 服务器返回了错误状态码 (4xx, 5xx)
                throw new Error(`API Error: ${error.response.status} - ${JSON.stringify(error.response.data)}`);
            } else if (error.request) {
                // 请求发出去了，但没有收到响应
                throw new Error('Network Error: No response received from StructOCR API');
            } else {
                // 设置请求时发生错误
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
     * Scan an Invoice (新增的 API)
     * @param {string} filePath - Path to the image file
     * @returns {Promise<object>} Structured JSON data
     */
    async scanInvoice(filePath) {
        // 'invoice' 是你后端 API 的具体路径，比如 https://api.structocr.com/v1/invoice
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
}

module.exports = StructOCR;