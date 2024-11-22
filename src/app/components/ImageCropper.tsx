"use client";
import React, { useRef, useState, useEffect, useCallback } from "react";
import Cropper, { ReactCropperElement } from "react-cropper";
import "cropperjs/dist/cropper.css";

interface ImageCropperProps {
  imageUrl: string;
  aspectRatio: number;
  onCrop: (croppedDataUrl: string) => void;
  onClose: () => void;
}

const ImageCropper: React.FC<ImageCropperProps> = ({
  imageUrl,
  aspectRatio,
  onCrop,
  onClose,
}) => {
  const cropperRef = useRef<ReactCropperElement>(null); // Correct ref type
  const [filteredImage, setFilteredImage] = useState(imageUrl);
  const [brightness, setBrightness] = useState(100);
  const [saturation, setSaturation] = useState(100);
  const [contrast, setContrast] = useState(100);
  const [flipHorizontal, setFlipHorizontal] = useState(false);
  const [rotation, setRotation] = useState(0);

  const transformImage = useCallback(
    async (sourceImage: HTMLImageElement) => {
      const canvas = document.createElement("canvas");
      const ctx = canvas.getContext("2d");
      if (!ctx) {
        console.error("Failed to create canvas context.");
        return imageUrl;
      }

      const isRotated90or270 = rotation === 90 || rotation === 270;
      canvas.width = isRotated90or270 ? sourceImage.height : sourceImage.width;
      canvas.height = isRotated90or270 ? sourceImage.width : sourceImage.height;

      ctx.save();
      ctx.translate(canvas.width / 2, canvas.height / 2);
      ctx.rotate((rotation * Math.PI) / 180);

      if (flipHorizontal) {
        ctx.scale(-1, 1);
      }

      ctx.filter = `
        brightness(${brightness}%) 
        saturate(${saturation}%) 
        contrast(${contrast}%)
      `;

      ctx.drawImage(
        sourceImage,
        -sourceImage.width / 2,
        -sourceImage.height / 2
      );
      ctx.restore();

      return canvas.toDataURL("image/png");
    },
    [brightness, saturation, contrast, rotation, flipHorizontal, imageUrl]
  );

  const generateFilteredPreview = useCallback(() => {
    const img = new Image();
    img.crossOrigin = "anonymous";
    img.src = imageUrl;

    img.onload = async () => {
      const transformedDataUrl = await transformImage(img);
      setFilteredImage(transformedDataUrl);
    };

    img.onerror = () => {
      console.error("Failed to load the image for transformation.");
    };
  }, [transformImage, imageUrl]);

  useEffect(() => {
    generateFilteredPreview();
  }, [generateFilteredPreview]);

  const getCroppedImage = () => {
    const cropper = cropperRef.current?.cropper; // Correctly typed cropper instance
    if (!cropper) {
      console.error("Cropper instance not found.");
      return;
    }

    const cropData = cropper.getData();
    const img = new Image();
    img.crossOrigin = "anonymous";
    img.src = filteredImage;

    img.onload = () => {
      const croppedCanvas = document.createElement("canvas");
      const ctx = croppedCanvas.getContext("2d");

      if (!ctx) {
        console.error("Failed to create cropping canvas context.");
        return;
      }

      croppedCanvas.width = cropData.width;
      croppedCanvas.height = cropData.height;

      ctx.drawImage(
        img,
        cropData.x,
        cropData.y, // Source X, Y
        cropData.width,
        cropData.height, // Source width, height
        0,
        0, // Destination X, Y
        cropData.width,
        cropData.height // Destination width, height
      );

      const croppedDataUrl = croppedCanvas.toDataURL("image/png");
      onCrop(croppedDataUrl);
    };

    img.onerror = () => {
      console.error("Failed to load transformed image for cropping.");
    };
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-90 flex items-center justify-center z-50 p-4 sm:p-8 m-0">
      <div className="bg-gray-800 text-white rounded-lg shadow-2xl w-full max-w-4xl max-h-[90vh] overflow-hidden flex flex-col sm:grid sm:grid-cols-2">
        {/* Preview Section */}
        <div className="flex flex-col items-center p-6 space-y-4 border-b sm:border-b-0 sm:border-r border-gray-700">
          <h3 className="text-xl font-bold text-blue-400">Preview</h3>
          <div className="relative w-full h-[300px] sm:h-[400px] overflow-hidden rounded-lg border border-gray-600">
            <Cropper
              src={filteredImage}
              style={{ height: "100%", width: "100%" }}
              aspectRatio={aspectRatio}
              guides={true}
              ref={cropperRef}
            />
          </div>
          <p className="text-sm text-stone-400">Scroll to zoom in and out</p>
        </div>

        {/* Adjustments Section */}
        <div className="p-6 space-y-8 overflow-y-auto max-h-[500px] sm:max-h-[90vh]">
          <h3 className="text-xl font-bold text-blue-400 sticky top-0 bg-gray-800 z-10 pb-2">
            Adjustments
          </h3>

          {/* Brightness, Saturation, Contrast Sliders */}
          {[
            { label: "Brightness", value: brightness, setValue: setBrightness },
            { label: "Saturation", value: saturation, setValue: setSaturation },
            { label: "Contrast", value: contrast, setValue: setContrast },
          ].map(({ label, value, setValue }, idx) => (
            <div key={idx}>
              <label className="block mb-2 text-gray-300 font-medium">
                {label}
              </label>
              <input
                type="range"
                min={0}
                max={200}
                value={value}
                onChange={(e) => setValue(parseInt(e.target.value))}
                className="w-full cursor-pointer accent-blue-500"
              />
            </div>
          ))}

          {/* Flip and Rotate Buttons */}
          <div>
            <label className="block mb-2 text-gray-300 font-medium">
              Flip & Rotate
            </label>
            <div className="flex flex-wrap gap-4">
              <button
                onClick={() => setFlipHorizontal(!flipHorizontal)}
                className="flex-1 py-2 px-4 bg-gray-700 hover:bg-gray-600 rounded-lg transition-all"
              >
                Flip Horizontal
              </button>
              <button
                onClick={() => setRotation((prev) => (prev - 90 + 360) % 360)}
                className="flex-1 py-2 px-4 bg-gray-700 hover:bg-gray-600 rounded-lg transition-all"
              >
                Rotate ⟲
              </button>
              <button
                onClick={() => setRotation((prev) => (prev + 90) % 360)}
                className="flex-1 py-2 px-4 bg-gray-700 hover:bg-gray-600 rounded-lg transition-all"
              >
                Rotate ⟳
              </button>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex justify-between mt-6 space-x-4 sticky bottom-0 bg-gray-800 pt-4">
            <button
              onClick={onClose}
              className="flex-1 py-3 px-5 bg-red-600 hover:bg-red-500 rounded-lg transition-all font-medium"
            >
              Cancel
            </button>
            <button
              onClick={getCroppedImage}
              className="flex-1 py-3 px-5 bg-blue-600 hover:bg-blue-500 rounded-lg transition-all font-medium"
            >
              Save Crop
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ImageCropper;
