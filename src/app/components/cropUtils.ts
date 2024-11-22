interface CroppedAreaPixels {
  x: number;
  y: number;
  width: number;
  height: number;
}

export const getCroppedImg = (
  imageUrl: string,
  croppedAreaPixels: CroppedAreaPixels,

  rotation: number = 0, // Rotation in degrees
  flipH: number = 1, // Horizontal flip multiplier (1 or -1)
  flipV: number = 1, // Vertical flip multiplier (1 or -1)
  brightness: number = 100, // Brightness percentage
  saturation: number = 100, // Saturation percentage
  contrast: number = 100 // Contrast percentage
): Promise<string> => {
  return new Promise((resolve, reject) => {
    const image = new Image();
    image.src = imageUrl;

    image.onload = () => {
      const canvas = document.createElement("canvas");
      const ctx = canvas.getContext("2d");

      if (ctx) {
        // Calculate rotated image dimensions
        const radians = (rotation * Math.PI) / 180;
        const rotatedWidth =
          Math.abs(image.width * Math.cos(radians)) +
          Math.abs(image.height * Math.sin(radians));
        const rotatedHeight =
          Math.abs(image.height * Math.cos(radians)) +
          Math.abs(image.width * Math.sin(radians));

        // Set canvas size to fit rotated image
        canvas.width = rotatedWidth;
        canvas.height = rotatedHeight;

        // Center the image on the canvas and rotate
        ctx.translate(rotatedWidth / 2, rotatedHeight / 2);
        ctx.rotate(radians);
        ctx.scale(flipH, flipV);
        ctx.drawImage(image, -image.width / 2, -image.height / 2);

        // Crop the image
        const croppedCanvas = document.createElement("canvas");
        croppedCanvas.width = croppedAreaPixels.width;
        croppedCanvas.height = croppedAreaPixels.height;
        const croppedCtx = croppedCanvas.getContext("2d");

        if (croppedCtx) {
          croppedCtx.drawImage(
            canvas,
            croppedAreaPixels.x,
            croppedAreaPixels.y,
            croppedAreaPixels.width,
            croppedAreaPixels.height,
            0,
            0,
            croppedAreaPixels.width,
            croppedAreaPixels.height
          );

          // Convert to base64
          const base64Image = croppedCanvas.toDataURL("image/png");
          resolve(base64Image);
        } else {
          reject("Cropped canvas context not found.");
        }
      } else {
        reject("Canvas context not found.");
      }
    };

    image.onerror = () => reject("Image loading failed.");
  });
};
