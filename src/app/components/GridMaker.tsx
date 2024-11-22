"use client";

import React, { useState, useRef, useEffect } from "react";
import ImageCropper from "@/app/components/ImageCropper"; // Adjust the path based on your folder structure
import { motion, AnimatePresence } from "framer-motion"; // Optional, but recommended for smooth transitions

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

// Predefined canvas sizes in mm

const PREDEFINED_SIZES = {
  A1: { width: 841, height: 594 },
  A2: { width: 594, height: 420 },
  A3: { width: 420, height: 297 },
  A4: { width: 297, height: 210 },
  A5: { width: 210, height: 148 },
} as const;

const GridMaker: React.FC = () => {
  // const [canvasType, setCanvasType] = useState<"predefined" | "custom">(
  //   "custom"
  // );

  const [dimensions, setDimensions] = useState<Dimensions>({
    width: 0,
    height: 0,
    cellSize: 0,
  });
  type SizeOption = keyof typeof PREDEFINED_SIZES | "custom";

  const [sizeOption, setSizeOption] = useState<SizeOption>("A4");
  const [orientation, setOrientation] = useState<"portrait" | "landscape">(
    "portrait"
  );
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [imageUrl, setImageUrl] = useState<string>("");
  const [gridColor, setGridColor] = useState("#ffffff"); // Default grid color
  const [showGridLabels, setShowGridLabels] = useState(true); // Show grid labels toggle
  const [showDiagonalLines, setShowDiagonalLines] = useState(false); // Show diagonal lines toggle
  const [showCropModal, setShowCropModal] = useState(false); // Show cropping modal
  const [croppedImageUrl, setCroppedImageUrl] = useState<string>("");

  const labelOptions: GridLabelOptions = {
    fontSize: 20,
    color: gridColor,
    padding: 5,
    showBackground: true,
    backgroundColor: "rgba(255, 255, 255, 0.7)",
  };

  const canvasRef = useRef<HTMLCanvasElement>(null);

  // Update dimensions when switching between predefined/custom or changing selections
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

    if (!ctx) return;

    const scale = 2; // Pixels per mm for display
    canvas.width = dimensions.width * scale;
    canvas.height = dimensions.height * scale;

    // Create an Image object and load the cropped image
    const image = new Image();
    image.src = croppedImageUrl;

    image.onload = () => {
      const imageAspectRatio = image.width / image.height;
      const canvasAspectRatio = dimensions.width / dimensions.height;
      let imgWidth = dimensions.width * scale;
      let imgHeight = dimensions.height * scale;

      // Adjust image size to fit within canvas dimensions
      if (imageAspectRatio > canvasAspectRatio) {
        imgHeight = imgWidth / imageAspectRatio;
      } else {
        imgWidth = imgHeight * imageAspectRatio;
      }

      // Center the image on the canvas
      const offsetX = (canvas.width - imgWidth) / 2;
      const offsetY = (canvas.height - imgHeight) / 2;

      // Draw the image on the canvas
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      ctx.drawImage(image, offsetX, offsetY, imgWidth, imgHeight);

      // Draw the grid on top of the image
      ctx.beginPath();
      ctx.strokeStyle = gridColor;
      ctx.lineWidth = 1;

      // Draw vertical lines
      // Draw vertical lines
      for (let x = 0; x <= canvas.width; x += dimensions.cellSize * scale) {
        ctx.moveTo(x, 0);
        ctx.lineTo(x, canvas.height);

        // Optionally, draw labels for the first row
        if (showGridLabels) {
          ctx.font = `${labelOptions.fontSize}px Arial`;
          ctx.fillStyle = labelOptions.color;
          ctx.fillText(
            `${Math.round(x / scale / dimensions.cellSize) + 1}`,
            x + labelOptions.padding,
            labelOptions.fontSize + labelOptions.padding
          );
        }
      }

      // Draw horizontal lines
      for (let y = 0; y <= canvas.height; y += dimensions.cellSize * scale) {
        ctx.moveTo(0, y);
        ctx.lineTo(canvas.width, y);

        // Optionally, draw labels for the first column
        if (showGridLabels) {
          ctx.font = `${labelOptions.fontSize}px Arial`;
          ctx.fillStyle = labelOptions.color;
          ctx.fillText(
            `${Math.round(y / scale / dimensions.cellSize) + 1}`,
            labelOptions.padding,
            y + labelOptions.fontSize + labelOptions.padding
          );
        }
      }
      // Draw diagonal lines if enabled
      if (showDiagonalLines) {
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

  useEffect(() => {
    if (sizeOption !== "custom") {
      const baseSize = PREDEFINED_SIZES[sizeOption];

      const width =
        orientation === "landscape" ? baseSize.height : baseSize.width;
      const height =
        orientation === "landscape" ? baseSize.width : baseSize.height;

      setDimensions((prev) => ({
        ...prev,
        width,
        height,
        cellSize: 0, // Default cell size
      }));
    }
  }, [sizeOption, orientation]);

  const handleDimensionChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    const parsedValue = parseFloat(value);
    if (parsedValue < 0) return; // Prevent negative values
    setDimensions((prev) => ({
      ...prev,
      [name]: parsedValue || 0,
    }));
  };

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setImageFile(file);
      const reader = new FileReader();
      reader.onloadend = () => {
        setImageUrl(reader.result as string);
        setShowCropModal(true);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleImageCrop = (croppedDataUrl: string) => {
    setCroppedImageUrl(croppedDataUrl);
    setShowCropModal(false);
  };

  const isDimensionsValid =
    dimensions.width > 0 && dimensions.height > 0 && dimensions.cellSize > 0;

  return (
    <div className="space-y-6">
      {/* Canvas Type Selection */}
      <div className="space-y-4  border-2 border-dashed border-gray-200 rounded-lg p-5">
        <fieldset>
          <legend className="text-lg font-semibold mb-4">
            Select Canvas Size
          </legend>

          {/* Size Options */}
          <div className="grid grid-cols-3 gap-4 mb-4">
            {([...Object.keys(PREDEFINED_SIZES), "custom"] as const).map(
              (size) => (
                <div key={size} className="flex items-center">
                  <input
                    type="radio"
                    id={`size-${size}`}
                    name="size"
                    value={size}
                    checked={sizeOption === size}
                    onChange={() => setSizeOption(size as SizeOption)}
                    className="mr-2"
                    aria-describedby={`size-${size}-desc`}
                  />
                  <label htmlFor={`size-${size}`} className="capitalize">
                    {size === "custom" ? "Custom" : size}
                  </label>
                </div>
              )
            )}
          </div>

          {/* Orientation Options */}
          <div className="flex space-x-4">
            {(["portrait", "landscape"] as const).map((orient) => (
              <div key={orient} className="flex items-center">
                <input
                  type="radio"
                  id={`orientation-${orient}`}
                  name="orientation"
                  value={orient}
                  checked={orientation === orient}
                  onChange={() => setOrientation(orient)}
                  className="mr-2"
                />
                <label htmlFor={`orientation-${orient}`} className="capitalize">
                  {orient}
                </label>
              </div>
            ))}
          </div>
        </fieldset>
      </div>

      {/* Custom Size Inputs with Animated Transition */}
      <AnimatePresence>
        {sizeOption === "custom" && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            className="grid grid-cols-1 md:grid-cols-3 gap-4 overflow-hidden"
          >
            <div className="space-y-2">
              <label htmlFor="width" className="block font-medium ">
                Canvas Width (mm)
              </label>
              <input
                id="width"
                name="width"
                type="number"
                min="0"
                value={dimensions.width || ""}
                onChange={handleDimensionChange}
                className="border border-gray-300 rounded-md px-3 py-2 w-full text-black"
                aria-required="true"
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
                className="border border-gray-300 rounded-md px-3 py-2 w-full text-black"
                aria-required="true"
              />
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Cell Size Input */}
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
          className="border border-gray-300 rounded-md px-3 py-2 w-full text-black"
          aria-describedby="cellSize-hint"
        />
        <p id="cellSize-hint" className="text-sm text-gray-500">
          Define the size of each grid cell in millimeters
        </p>
      </div>

      {/* Image Upload Input */}
      <div className="space-y-2">
        <label htmlFor="image" className="block font-medium">
          Upload Image
        </label>
        <input
          id="image"
          type="file"
          accept="image/*"
          onChange={handleImageUpload}
          className={`border border-gray-300 rounded-md px-3 py-2 w-full ${
            isDimensionsValid ? "" : "cursor-not-allowed opacity-50"
          }`}
          disabled={!isDimensionsValid}
        />
        {!isDimensionsValid && (
          <p className="text-sm text-stone-500">
            Please set valid dimensions before uploading an image.
          </p>
        )}
      </div>

      <div className="h-[30vh] sm:h-[500px] border-2 border-dashed border-gray-200 rounded-lg flex flex-col items-center justify-center space-y-4">
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
      <div className="flex flex-wrap items-center gap-4 p-4 bg-black text-white rounded-lg">
        {/* Grid Color Picker */}
        <div className="flex items-center gap-2">
          <input
            id="gridColor"
            type="color"
            value={gridColor}
            onChange={(e) => setGridColor(e.target.value)}
            className="w-5 h-5 rounded-md border-none outline-none"
          />
          <label htmlFor="gridColor" className="font-medium">
            Grid Color
          </label>
        </div>

        {/* Show Grid Labels Toggle */}
        <div className="flex items-center gap-2">
          <input
            type="checkbox"
            checked={showGridLabels}
            onChange={() => setShowGridLabels((prev) => !prev)}
            id="gridLabels"
            className="w-5 h-5 bg-gray-800 accent-white"
          />
          <label htmlFor="gridLabels" className="font-medium cursor-pointer">
            Show Grid Labels
          </label>
        </div>

        {/* Show Diagonal Lines Toggle */}
        <div className="flex items-center gap-2">
          <input
            type="checkbox"
            checked={showDiagonalLines}
            onChange={() => setShowDiagonalLines((prev) => !prev)}
            id="diagonalLines"
            className="w-5 h-5 bg-gray-800 accent-white"
          />
          <label htmlFor="diagonalLines" className="font-medium cursor-pointer">
            Show Diagonal Lines
          </label>
        </div>

        {/* Save Button */}
        {imageFile && (
          <button
            onClick={() => {
              if (canvasRef.current) {
                const canvas = canvasRef.current as HTMLCanvasElement;
                const link = document.createElement("a");
                link.download = "canvas-image.png";
                link.href = canvas.toDataURL("image/png");
                link.click();
              }
            }}
            className="flex items-center gap-2 bg-gray-800 text-white px-4 py-2 rounded-md hover:bg-gray-700 transition-all duration-150"
          >
            Save
            {/* Download Icon */}
            <img
              src="https://img.icons8.com/?size=100&id=1o4BrawNfLIv&format=png&color=000000"
              alt="Download"
              className="w-5 h-5"
            />
          </button>
        )}
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
