"use client";

import React, { useState, useRef, useEffect } from "react";
import ImageCropper from "@/app/components/ImageCropper"; // Adjust the path based on your folder structure
import ImageEditor from "./ImageEditor";

interface Dimensions {
  width: number;
  height: number;
  cellSize: number;
}

interface GridLabelOptions {
  fontSize: number;
  color: string;
  padding: number;
  showBackground: boolean;
  backgroundColor: string;
}

// Usage in drawing code:
const labelOptions: GridLabelOptions = {
  fontSize: 20,
  color: "black",
  padding: 5,
  showBackground: true,
  backgroundColor: "rgba(255, 255, 255, 0.7)",
};

const GridMaker: React.FC = () => {
  const [dimensions, setDimensions] = useState<Dimensions>({
    width: 0,
    height: 0,
    cellSize: 0,
  });

  const [imageFile, setImageFile] = useState<File | null>(null);
  const [imageUrl, setImageUrl] = useState<string>("");
  const [gridColor, setGridColor] = useState("#000000"); // Default grid color
  const [showGridLabels, setShowGridLabels] = useState(true); // Show grid labels toggle
  const [showDiagonalLines, setShowDiagonalLines] = useState(false); // Show diagonal lines toggle
  const [showCropModal, setShowCropModal] = useState(false); // Show cropping modal
  const [croppedImageUrl, setCroppedImageUrl] = useState<string>("");

  const canvasRef = useRef<HTMLCanvasElement>(null);
  const imageRef = useRef<HTMLImageElement>(null);

  // Handle input changes for dimensions
  const handleDimensionChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setDimensions((prev) => ({
      ...prev,
      [name]: parseFloat(value) || 0,
    }));
  };

  // Handle image file upload
  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setImageFile(file);
      const reader = new FileReader();
      reader.onloadend = () => {
        setImageUrl(reader.result as string);
        setShowCropModal(true); // Show crop modal after image upload
      };
      reader.readAsDataURL(file);
    }
  };

  // Draw the grid and image on the canvas
  useEffect(() => {
    if (
      !canvasRef.current ||
      !croppedImageUrl ||
      !dimensions.width ||
      !dimensions.height ||
      !dimensions.cellSize
    ) {
      return;
    }

    const canvas = canvasRef.current;
    const ctx = canvas.getContext("2d");

    if (!ctx) {
      return;
    }

    // Set the canvas size based on the physical dimensions
    const scale = 2; // 2 pixels per mm for display
    canvas.width = dimensions.width * scale;
    canvas.height = dimensions.height * scale;

    // Draw the cropped image on the canvas
    const image = new Image();
    image.src = croppedImageUrl;
    image.onload = () => {
      const imageAspectRatio = image.width / image.height;
      const canvasAspectRatio = dimensions.width / dimensions.height;
      let imgWidth = dimensions.width * scale;
      let imgHeight = dimensions.height * scale;

      // Adjust image size based on the aspect ratio
      if (imageAspectRatio > canvasAspectRatio) {
        imgHeight = imgWidth / imageAspectRatio;
      } else {
        imgWidth = imgHeight * imageAspectRatio;
      }

      // Center image on canvas
      const offsetX = (canvas.width - imgWidth) / 2;
      const offsetY = (canvas.height - imgHeight) / 2;

      ctx.drawImage(image, offsetX, offsetY, imgWidth, imgHeight);

      // Draw the grid on top of the image
      ctx.beginPath();
      ctx.strokeStyle = gridColor;
      ctx.lineWidth = 2;

      // Draw vertical lines
      for (let x = 0; x <= canvas.width; x += dimensions.cellSize * scale) {
        ctx.moveTo(x, 0);
        ctx.lineTo(x, canvas.height);

        if (showGridLabels) {
          ctx.font = `${labelOptions.fontSize}px`;
          ctx.fillStyle = labelOptions.color;
          ctx.fillText(
            `${Math.round(x / scale / dimensions.cellSize)}`,
            x + 5,
            15
          );
        }
      }

      // Draw horizontal lines
      for (let y = 0; y <= canvas.height; y += dimensions.cellSize * scale) {
        ctx.moveTo(0, y);
        ctx.lineTo(canvas.width, y);

        if (showGridLabels) {
          ctx.font = `${labelOptions.fontSize}px`;
          ctx.fillStyle = labelOptions.color;
          ctx.fillText(
            `${Math.round(y / scale / dimensions.cellSize)}`,
            5,
            y + 15
          );
        }
      }

      // Draw diagonal lines if enabled
      if (showDiagonalLines) {
        ctx.font = `${labelOptions.fontSize}px`;
        ctx.fillStyle = labelOptions.color;
        for (let x = 0; x <= canvas.width; x += dimensions.cellSize * scale) {
          for (
            let y = 0;
            y <= canvas.height;
            y += dimensions.cellSize * scale
          ) {
            ctx.moveTo(x, y);
            ctx.lineTo(
              x + dimensions.cellSize * scale,
              y + dimensions.cellSize * scale
            );
            ctx.moveTo(x, y + dimensions.cellSize * scale);
            ctx.lineTo(x + dimensions.cellSize * scale, y);
          }
        }
      }

      ctx.stroke();
    };
  }, [
    dimensions,
    croppedImageUrl,
    gridColor,
    showGridLabels,
    showDiagonalLines,
  ]);

  // Crop the image based on the selected region
  const handleImageCrop = (croppedDataUrl: string) => {
    setCroppedImageUrl(croppedDataUrl);
    setShowCropModal(false); // Close crop modal after cropping

    const link = document.createElement("a");
    link.href = croppedDataUrl;
    link.download = "cropped-image.png"; // Set desired filename

    // Trigger download
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="space-y-2">
          <label htmlFor="width" className="block font-medium">
            Canvas Width (mm)
          </label>
          <input
            id="width"
            name="width"
            type="number"
            min="0"
            value={dimensions.width || ""}
            onChange={handleDimensionChange}
            placeholder="Enter width"
            className="border border-gray-300 rounded-md px-3 py-2 w-full text-black"
          />
        </div>
        <div className="space-y-2">
          <label htmlFor="height" className="block font-medium">
            Canvas Height (mm)
          </label>
          <input
            id="height"
            name="height"
            type="number"
            min="0"
            value={dimensions.height || ""}
            onChange={handleDimensionChange}
            placeholder="Enter height"
            className="border border-gray-300 rounded-md px-3 py-2 w-full  text-black"
          />
        </div>
        <div className="space-y-2">
          <label htmlFor="cellSize" className="block font-medium">
            Grid Cell Size (mm)
          </label>
          <input
            id="cellSize"
            name="cellSize"
            type="number"
            min="0"
            value={dimensions.cellSize || ""}
            onChange={handleDimensionChange}
            placeholder="Enter cell size"
            className="border border-gray-300 rounded-md px-3 py-2 w-full  text-black"
          />
        </div>
      </div>

      <div className="space-y-2">
        <label htmlFor="image" className="block font-medium">
          Upload Image
        </label>
        <input
          id="image"
          type="file"
          accept="image/*"
          onChange={handleImageUpload}
          className="border border-gray-300 rounded-md px-3 py-2 w-full"
        />
      </div>

      <div className="h-[500px] border-2 border-dashed border-gray-200 rounded-lg flex items-center justify-center">
        {imageFile ? (
          <div className="w-full h-full flex items-center justify-center">
            <canvas
              ref={canvasRef}
              className="max-w-full max-h-full object-scale-down"
            />
          </div>
        ) : (
          <p className="text-gray-500">Upload an image to begin</p>
        )}
      </div>

      {/* Grid customization */}
      {/* Grid customization */}
      <div className="flex space-x-4">
        <div className="flex items-center space-x-2">
          <label htmlFor="gridColor" className="font-medium">
            Grid Color
          </label>
          <input
            id="gridColor"
            type="color"
            value={gridColor}
            onChange={(e) => setGridColor(e.target.value)}
            className="w-16"
          />
        </div>

        <div className="flex items-center space-x-2">
          <input
            type="checkbox"
            checked={showGridLabels}
            onChange={() => setShowGridLabels((prev) => !prev)}
            id="gridLabels"
            className="mr-2"
          />
          <label htmlFor="gridLabels">Show Grid Labels</label>
        </div>

        <div className="flex items-center space-x-2">
          <input
            type="checkbox"
            checked={showDiagonalLines}
            onChange={() => setShowDiagonalLines((prev) => !prev)}
            id="diagonalLines"
            className="mr-2"
          />
          <label htmlFor="diagonalLines">Show Diagonal Lines</label>
        </div>
      </div>

      {/* Cropping modal */}
      {showCropModal && imageUrl && dimensions?.width && dimensions?.height && (
        <ImageCropper
          imageUrl={imageUrl}
          aspectRatio={
            dimensions?.width && dimensions?.height
              ? dimensions.width / dimensions.height
              : 1
          } // Fallback to 1:1 ratio
          onCrop={handleImageCrop}
          onClose={() => setShowCropModal(false)}
        />
      )}
    </div>
  );
};

export default GridMaker;
