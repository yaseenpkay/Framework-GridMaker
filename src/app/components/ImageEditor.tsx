"use client";
import React, { useRef, useState, useCallback, useEffect } from "react";
import Cropper from "react-cropper";
import "cropperjs/dist/cropper.css";

interface ImageEditorProps {
  imageUrl: string;
  aspectRatio: number;
  onCrop: (croppedDataUrl: string) => void;
  onClose: () => void;
}

const ImageEditor: React.FC<ImageEditorProps> = ({
  imageUrl,
  aspectRatio,
  onCrop,
  onClose,
}) => {
  const cropperRef = useRef<any>(null);
  const [isImageLoaded, setIsImageLoaded] = useState(false);
  const [imageSettings, setImageSettings] = useState({
    brightness: 100,
    saturation: 100,
    contrast: 100,
    rotation: 0,
    flipH: 1,
    flipV: 1,
  });

  const handleImageLoaded = useCallback(() => {
    setIsImageLoaded(true);

    // Safe zoom after initialization
    if (cropperRef.current) {
      const cropper = cropperRef.current?.cropper;
      if (cropper) {
        cropper.zoomTo(0.5);
      }
    }
  }, []);

  const resetSettings = useCallback(() => {
    setImageSettings({
      brightness: 100,
      saturation: 100,
      contrast: 100,
      rotation: 0,
      flipH: 1,
      flipV: 1,
    });
  }, []);

  const getCroppedImage = useCallback(() => {
    try {
      if (!cropperRef.current || !isImageLoaded) {
        console.error("Cropper not ready");
        return;
      }

      const cropper = cropperRef.current.cropper;
      const canvas = cropper.getCroppedCanvas({
        imageSmoothingEnabled: true,
        imageSmoothingQuality: "high",
      });

      if (!canvas) {
        console.error("Canvas creation failed");
        return;
      }

      const { brightness, saturation, contrast, rotation, flipH, flipV } =
        imageSettings;

      const transformedCanvas = document.createElement("canvas");
      transformedCanvas.width = canvas.width;
      transformedCanvas.height = canvas.height;

      const ctx = transformedCanvas.getContext("2d");
      if (!ctx) {
        console.error("Context creation failed");
        return;
      }

      ctx.save();
      ctx.translate(canvas.width / 2, canvas.height / 2);
      ctx.scale(flipH, flipV);
      ctx.rotate((rotation * Math.PI) / 180);

      ctx.filter = `brightness(${brightness}%) saturate(${saturation}%) contrast(${contrast}%)`;

      ctx.drawImage(canvas, -canvas.width / 2, -canvas.height / 2);
      ctx.restore();

      const finalImage = transformedCanvas.toDataURL("image/png");
      onCrop(finalImage);
    } catch (error) {
      console.error("Crop processing error:", error);
    }
  }, [imageSettings, isImageLoaded, onCrop]);

  const updateSetting = useCallback(
    (key: keyof typeof imageSettings, value: number) => {
      setImageSettings((prev) => {
        const newSettings = { ...prev, [key]: value };

        // Apply cropper transformations
        if (cropperRef.current) {
          const cropper = cropperRef.current?.cropper;
          if (cropper) {
            switch (key) {
              case "rotation":
                cropper.rotate(value - prev.rotation);
                break;
              case "flipH":
                cropper.scale(value, prev.flipV);
                break;
              case "flipV":
                cropper.scale(prev.flipH, value);
                break;
              default:
                break;
            }
          }
        }
        return newSettings;
      });
    },
    []
  );

  const controlConfig = [
    { label: "Brightness", key: "brightness", min: 0, max: 200 },
    { label: "Saturation", key: "saturation", min: 0, max: 200 },
    { label: "Contrast", key: "contrast", min: 0, max: 200 },
  ];

  return (
    <div className="fixed inset-0 bg-gradient-to-br from-gray-900 via-black to-gray-800 flex items-center justify-center z-50">
      <div className="bg-gray-900 text-white rounded-lg shadow-xl w-[95%] max-w-6xl max-h-[90vh] overflow-hidden grid grid-cols-1 md:grid-cols-2">
        <div className="p-6 flex flex-col items-center justify-center space-y-4 border-b md:border-b-0 md:border-r border-gray-700">
          <Cropper
            ref={cropperRef}
            src={imageUrl}
            style={{ height: 400, width: 400 }}
            aspectRatio={aspectRatio}
            guides={true}
            ready={handleImageLoaded}
            viewMode={1}
            dragMode="move"
            scalable={true}
            cropBoxResizable={true}
            zoomable={true}
            background={false}
            rotatable={true}
            toggleDragModeOnDblclick={false}
          />
        </div>

        <div className="p-6 overflow-y-auto space-y-6">
          {isImageLoaded ? (
            <>
              <h3 className="text-xl font-semibold mb-2">Adjustments</h3>
              {controlConfig.map(({ label, key, min, max }) => (
                <div key={key}>
                  <label className="block mb-1 text-gray-400">
                    {label}: {imageSettings[key as keyof typeof imageSettings]}%
                  </label>
                  <input
                    type="range"
                    min={min}
                    max={max}
                    value={imageSettings[key as keyof typeof imageSettings]}
                    onChange={(e) =>
                      updateSetting(
                        key as keyof typeof imageSettings,
                        parseInt(e.target.value)
                      )
                    }
                    className="w-full cursor-pointer accent-blue-500"
                  />
                </div>
              ))}

              <div className="grid grid-cols-2 gap-2">
                <button
                  onClick={() =>
                    updateSetting("flipH", imageSettings.flipH * -1)
                  }
                >
                  Flip Horizontal
                </button>
                <button
                  onClick={() =>
                    updateSetting("flipV", imageSettings.flipV * -1)
                  }
                >
                  Flip Vertical
                </button>
                <button
                  onClick={() =>
                    updateSetting("rotation", imageSettings.rotation + 90)
                  }
                >
                  Rotate +90°
                </button>
                <button
                  onClick={() =>
                    updateSetting("rotation", imageSettings.rotation - 90)
                  }
                >
                  Rotate -90°
                </button>
              </div>

              <div className="flex justify-between mt-6">
                <button onClick={onClose} className="bg-red-500 px-4 py-2">
                  Cancel
                </button>
                <button
                  onClick={resetSettings}
                  className="bg-gray-500 px-4 py-2"
                >
                  Reset
                </button>
                <button
                  onClick={getCroppedImage}
                  className="bg-blue-500 px-4 py-2"
                >
                  Save Crop
                </button>
              </div>
            </>
          ) : (
            <div className="flex items-center justify-center h-full">
              Loading Image...
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default ImageEditor;
