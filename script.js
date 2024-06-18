document.addEventListener('DOMContentLoaded', () => {
  const video = document.getElementById('video');
  const canvas = document.getElementById('canvas');
  const snapButton = document.getElementById('snap');
  const originalImage = document.getElementById('originalImage');
  const labeledImage = document.getElementById('labeledImage');
  const output = document.getElementById('output');

  // Get access to the camera
  if (navigator.mediaDevices && navigator.mediaDevices.getUserMedia) {
      navigator.mediaDevices.getUserMedia({ video: true }).then(stream => {
          video.srcObject = stream;
          video.play();
      });
  }

  // Capture the photo
  snapButton.addEventListener('click', () => {
      const context = canvas.getContext('2d');
      context.drawImage(video, 0, 0, 640, 480);
      const dataURL = canvas.toDataURL('image/png');
      originalImage.src = dataURL;
      originalImage.style.display = 'block';

      // Send the image to the server
      fetch('/upload', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ image: dataURL })
      })
      .then(response => response.json())
      .then(data => {
          if (data.labeledImageUrl) {
              labeledImage.src = data.labeledImageUrl;
              labeledImage.style.display = 'block';
              output.textContent = 'Image processed successfully!';
          } else {
              output.textContent = 'Failed to process image';
          }
      })
      .catch(error => {
          console.error('Error:', error);
          output.textContent = 'An error occurred';
      });
  });
});


app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, 'index.html'));
});