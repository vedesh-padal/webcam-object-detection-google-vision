const express = require('express');
const bodyParser = require('body-parser');
const vision = require('@google-cloud/vision');
const Jimp = require('jimp');
const fs = require('fs');
const path = require('path');

// Load the service account key
const keyFilename = path.join(__dirname, 'key.json');

// Create a client
const client = new vision.ImageAnnotatorClient({ keyFilename });

const app = express();
const PORT = process.env.PORT || 3000;

app.use(bodyParser.json({ limit: '50mb' }));
app.use(express.static('public'));

// Function to draw bounding boxes and labels
async function drawBoundingBoxes(imagePath, annotations) {
    const image = await Jimp.read(imagePath);
    const font = await Jimp.loadFont(Jimp.FONT_SANS_16_WHITE);

    for (const annotation of annotations) {
        const vertices = annotation.boundingPoly.normalizedVertices;
        const label = annotation.name;
        const x1 = vertices[0].x * image.bitmap.width;
        const y1 = vertices[0].y * image.bitmap.height;
        const x2 = vertices[2].x * image.bitmap.width;
        const y2 = vertices[2].y * image.bitmap.height;

        // Draw the bounding box
        image.scan(x1, y1, x2 - x1, 2, (x, y, idx) => {
            image.bitmap.data[idx] = 255;     // Red
            image.bitmap.data[idx + 1] = 0;   // Green
            image.bitmap.data[idx + 2] = 0;   // Blue
            image.bitmap.data[idx + 3] = 255; // Alpha
        });
        image.scan(x1, y2, x2 - x1, 2, (x, y, idx) => {
            image.bitmap.data[idx] = 255;
            image.bitmap.data[idx + 1] = 0;
            image.bitmap.data[idx + 2] = 0;
            image.bitmap.data[idx + 3] = 255;
        });
        image.scan(x1, y1, 2, y2 - y1, (x, y, idx) => {
            image.bitmap.data[idx] = 255;
            image.bitmap.data[idx + 1] = 0;
            image.bitmap.data[idx + 2] = 0;
            image.bitmap.data[idx + 3] = 255;
        });
        image.scan(x2, y1, 2, y2 - y1, (x, y, idx) => {
            image.bitmap.data[idx] = 255;
            image.bitmap.data[idx + 1] = 0;
            image.bitmap.data[idx + 2] = 0;
            image.bitmap.data[idx + 3] = 255;
        });

        // Draw the label
        image.print(font, x1 + 5, y1 + 5, label);
    }

    return image;
}

app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, 'index.html'));
});

app.post('/upload', async (req, res) => {
    try {
        const imgData = req.body.image;
        const base64Data = imgData.replace(/^data:image\/png;base64,/, "");
        const originalImagePath = 'public/original/captured_image.png';
        const labeledImagePath = 'public/labeled/labeled_image.png';

        // Ensure directories exist
        fs.mkdirSync(path.dirname(originalImagePath), { recursive: true });
        fs.mkdirSync(path.dirname(labeledImagePath), { recursive: true });

        // Save the original image
        fs.writeFileSync(originalImagePath, base64Data, 'base64');

        // Perform object localization
        const [result] = await client.objectLocalization({ image: { content: base64Data } });
        const annotations = result.localizedObjectAnnotations;

        // Draw bounding boxes and labels
        const labeledImage = await drawBoundingBoxes(originalImagePath, annotations);

        // Save the labeled image
        await labeledImage.writeAsync(labeledImagePath);

        // Send the labeled image to the client
        res.send({ message: 'Image processed successfully', labeledImageUrl: `http://localhost:${PORT}/labeled/labeled_image.png` });
    } catch (error) {
        console.error('Error processing image:', error);
        res.status(500).send({ message: 'Failed to process image' });
    }
});

app.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
});
