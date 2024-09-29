import React, { useState } from 'react';

const ImageConverter = () => {
    const [webpImage, setWebpImage] = useState(null);
    const [maxWidth, setMaxWidth] = useState(300); // Default max width

    const handleImageUpload = (event) => {
        const file = event.target.files[0];
        if (file) {
            const reader = new FileReader();
            reader.onload = function (e) {
                const img = new Image();
                img.src = e.target.result;

                img.onload = function () {
                    // Create a canvas element
                    const canvas = document.createElement('canvas');
                    const ctx = canvas.getContext('2d');

                    // Calculate aspect ratio and set custom max width while maintaining aspect ratio
                    const aspectRatio = img.height / img.width;
                    const newWidth = Math.min(img.width, maxWidth); // Ensure image does not exceed max width
                    const newHeight = newWidth * aspectRatio;

                    // Set canvas size to the new dimensions
                    canvas.width = newWidth;
                    canvas.height = newHeight;

                    // Draw the image on the canvas with new dimensions
                    ctx.drawImage(img, 0, 0, newWidth, newHeight);

                    // Convert the canvas content to WebP
                    const webpUrl = canvas.toDataURL('image/webp');

                    // Set the WebP image to state to display/download
                    setWebpImage(webpUrl);
                };
            };
            reader.readAsDataURL(file); // Read file as Data URL
        }
    };

    return (
        <div>
            <div>
                <label htmlFor="max-width">Max Width: </label>
                <input
                    type="number"
                    id="max-width"
                    value={maxWidth}
                    onChange={(e) => setMaxWidth(e.target.value)}
                    style={{ marginBottom: '10px' }}
                />
            </div>
            <input type="file" accept="image/*" onChange={handleImageUpload} />
            {webpImage && (
                <div>
                    <h3>Converted Image:</h3>
                    <img style={{ width: '400px' }} src={webpImage} alt="WebP format" />
                    <br />
                    <a href={webpImage} download="converted-image.webp">
                        Download WebP Image
                    </a>
                </div>
            )}
        </div>
    );
};

export default ImageConverter;
