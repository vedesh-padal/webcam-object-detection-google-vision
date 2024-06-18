# Webcam Object Detection with Google Vision API

This project demonstrates real-time object detection using a webcam and Google Vision API. It captures a photo from the webcam, sends it to a Node.js backend for processing using Google Cloud's Vision API, and displays the processed image with bounding boxes and labels on a web interface.

## How It Works

1. **Frontend (HTML, CSS, JavaScript):**

   - Uses HTML5 `<video>` element to access the webcam stream.
   - Allows users to capture a photo from the webcam using a `<canvas>` element.
   - Sends the captured image as a base64-encoded data URL to the Node.js backend via a POST request.
   - Displays the original and processed images on the webpage using `<img>` tags.

2. **Backend (Node.js):**

   - Receives the base64-encoded image data from the frontend.
   - Sends the image data to Google Vision API's `objectLocalization` method for object detection.
   - Draws bounding boxes and labels around detected objects on the original image using the `Jimp` library.
   - Saves the labeled image locally and sends its URL back to the frontend.

3. **Technologies Used:**
   - **Frontend:** HTML, CSS, JavaScript (ES6+)
   - **Backend:** Node.js, Express.js
   - **Libraries:** `Jimp` (for image manipulation), `@google-cloud/vision` (Google Vision API client)
   - **Other Tools:** Google Cloud Platform (for Vision API), Git (for version control)

## Prerequisites

Before running the project, ensure you have the following installed:

- Node.js and npm (Node Package Manager)
- Google Cloud Platform account with Vision API enabled and service account key (`key.json`)

## Setup and Usage

1. Clone the repository:

    ```bash
    git clone https://github.com/yourusername/webcam-object-detection.git
    cd webcam-object-detection
    ```

2. Install Dependencies:

    ```bash
      npm install
    ```

3. Add your Google Cloud service account key (key.json) to the root directory.

4. Start the Node.js server:
   ```bash
     node index.js
   ```
5. Open your web browser and navigate to http://localhost:3000 to access the application.

6. Click the "Capture" button to capture a photo from your webcam and see the object detection results.