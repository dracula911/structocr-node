const StructOCR = require('./index');
const path = require('path');

// Initialize with the provided API Key
const apiKey = '';
const client = new StructOCR(apiKey);

// Path to the test image
// Based on the user's input and directory structure, 'test' is a sibling of 'structocr-node'
const imagePath = path.resolve(__dirname, '../test/re01.jpg');

console.log(`Testing VIN OCR with image: ${imagePath}`);

(async () => {
    try {
        // Scan VIN
        const vinData = await client.scanReceipt(imagePath);

        console.log('--- VIN OCR Result ---');
        console.log(JSON.stringify(vinData, null, 2));

    } catch (error) {
        console.error('OCR Error:', error.message);
    }
})();
