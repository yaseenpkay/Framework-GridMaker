// "use client";
// import React, { useRef, useState, useEffect, useCallback } from "react";
// import Cropper from "react-cropper";
// import "cropperjs/dist/cropper.css";

// interface ImageCropperProps {
//   imageUrl: string;
//   aspectRatio: number;
//   onCrop: (croppedDataUrl: string) => void;
//   onClose: () => void;
// }

// const ImageCropper: React.FC<ImageCropperProps> = ({
//   imageUrl,
//   aspectRatio,
//   onCrop,
//   onClose,
// }) => {
//   const cropperRef = useRef<HTMLImageElement>(null);
//   const [filteredImage, setFilteredImage] = useState(imageUrl);
//   const [brightness, setBrightness] = useState(100);
//   const [saturation, setSaturation] = useState(100);
//   const [contrast, setContrast] = useState(100);
//   const [flipHorizontal, setFlipHorizontal] = useState(false);
//   const [rotation, setRotation] = useState(0); // Rotation angle in degrees

//   const applyTransformations = (
//     canvas: HTMLCanvasElement,
//     img: HTMLImageElement
//   ) => {
//     const ctx = canvas.getContext("2d");
//     if (!ctx) return;

//     if (rotation === 90 || rotation === 270) {
//       canvas.width = img.height;
//       canvas.height = img.width;
//     } else {
//       canvas.width = img.width;
//       canvas.height = img.height;
//     }

//     ctx.save();
//     ctx.translate(canvas.width / 2, canvas.height / 2);
//     ctx.rotate((rotation * Math.PI) / 180);

//     if (flipHorizontal) {
//       ctx.scale(-1, 1);
//     }

//     ctx.filter = `brightness(${brightness}%) saturate(${saturation}%) contrast(${contrast}%)`;
//     ctx.drawImage(img, -img.width / 2, -img.height / 2);
//     ctx.restore();
//   };

//   // Generate a transformed and filtered preview
//   const generateFilteredPreview = useCallback(() => {
//     const img = new Image();
//     img.crossOrigin = "anonymous";
//     img.src = imageUrl;

//     img.onload = () => {
//       const canvas = document.createElement("canvas");
//       applyTransformations(canvas, img);
//       setFilteredImage(canvas.toDataURL("image/png"));
//     };
//   }, [brightness, saturation, contrast, rotation, flipHorizontal, imageUrl]);

//   useEffect(() => {
//     generateFilteredPreview();
//   }, [generateFilteredPreview]);

//   // Get the cropped and transformed image
//   const getCroppedImage = () => {
//     const cropper = cropperRef.current?.cropper;
//     if (!cropper) return;

//     // Get cropped area from Cropper.js
//     const croppedCanvas = cropper.getCroppedCanvas();
//     if (!croppedCanvas) return;

//     const croppedImage = new Image();
//     croppedImage.src = croppedCanvas.toDataURL("image/png");

//     croppedImage.onload = () => {
//       const tempCanvas = document.createElement("canvas");
//       const tempCtx = tempCanvas.getContext("2d");
//       if (!tempCtx) return;

//       // Apply transformations BEFORE cropping
//       tempCanvas.width = croppedImage.width;
//       tempCanvas.height = croppedImage.height;

//       tempCtx.save();

//       // Translate and rotate canvas to match transformations
//       tempCtx.translate(tempCanvas.width / 2, tempCanvas.height / 2);
//       tempCtx.rotate((rotation * Math.PI) / 180);

//       // Flip horizontally if needed
//       if (flipHorizontal) {
//         tempCtx.scale(-1, 1);
//       }

//       // Apply filters
//       tempCtx.filter = `brightness(${brightness}%) saturate(${saturation}%) contrast(${contrast}%)`;

//       // Draw the image with transformations
//       tempCtx.drawImage(
//         croppedImage,
//         -croppedImage.width / 2,
//         -croppedImage.height / 2
//       );

//       tempCtx.restore();

//       // Convert the transformed canvas to a data URL
//       onCrop(tempCanvas.toDataURL("image/png"));
//     };
//   };

//   return (
//     <div className="fixed inset-0 bg-black bg-opacity-80 flex items-center justify-center z-50">
//       <div className="bg-gray-900 text-white rounded-lg shadow-xl w-[95%] max-w-6xl max-h-[90vh] overflow-hidden grid grid-cols-1 md:grid-cols-2">
//         {/* Left: Preview Section */}
//         <div className="p-6 flex flex-col items-center space-y-4 border-b md:border-b-0 md:border-r border-gray-700">
//           <h3 className="text-xl font-semibold">Preview</h3>
//           <Cropper
//             src={filteredImage}
//             style={{ height: 400, width: "100%" }}
//             aspectRatio={aspectRatio}
//             guides={true}
//             ref={cropperRef}
//           />
//         </div>

//         {/* Right: Controls */}
//         <div className="p-6 overflow-y-auto space-y-6">
//           <h3 className="text-xl font-semibold">Adjustments</h3>
//           {/* Filters */}
//           {[
//             { label: "Brightness", value: brightness, setValue: setBrightness },
//             { label: "Saturation", value: saturation, setValue: setSaturation },
//             { label: "Contrast", value: contrast, setValue: setContrast },
//           ].map(({ label, value, setValue }, idx) => (
//             <div key={idx}>
//               <label className="block mb-1 text-gray-400">{label}:</label>
//               <input
//                 type="range"
//                 min={0}
//                 max={200}
//                 value={value}
//                 onChange={(e) => setValue(parseInt(e.target.value))}
//                 className="w-full cursor-pointer accent-blue-500"
//               />
//             </div>
//           ))}

//           {/* Flip and Rotate */}
//           <div>
//             <label className="block mb-1 text-gray-400">Flip & Rotate:</label>
//             <div className="flex items-center space-x-4">
//               {/* Flip Horizontal */}
//               <button
//                 onClick={() => setFlipHorizontal(!flipHorizontal)}
//                 className="py-2 px-4 bg-gray-700 hover:bg-gray-600 rounded-md"
//               >
//                 Flip Horizontal
//               </button>

//               {/* Rotate Anticlockwise */}
//               <button
//                 onClick={() => setRotation((prev) => (prev - 90 + 360) % 360)}
//                 className="py-2 px-4 bg-gray-700 hover:bg-gray-600 rounded-md"
//               >
//                 Rotate ⟲
//               </button>

//               {/* Rotate Clockwise */}
//               <button
//                 onClick={() => setRotation((prev) => (prev + 90) % 360)}
//                 className="py-2 px-4 bg-gray-700 hover:bg-gray-600 rounded-md"
//               >
//                 Rotate ⟳
//               </button>
//             </div>
//           </div>

//           {/* Save and Cancel */}
//           <div className="flex justify-between mt-6">
//             <button
//               onClick={onClose}
//               className="py-2 px-4 bg-red-600 hover:bg-red-500 rounded-md"
//             >
//               Cancel
//             </button>
//             <button
//               onClick={getCroppedImage}
//               className="py-2 px-4 bg-blue-600 hover:bg-blue-500 rounded-md"
//             >
//               Save Crop
//             </button>
//           </div>
//         </div>
//       </div>
//     </div>
//   );
// };

// export default ImageCropper;

"use client";
import React, { useRef, useState, useEffect, useCallback } from "react";
import Cropper from "react-cropper";
import "cropperjs/dist/cropper.css";

interface ImageCropperProps {
  imageUrl: string;
  aspectRatio: number;
  onCrop: (croppedDataUrl: string) => void;
  onClose: () => void;
}

const transformImage = (
  sourceImage: HTMLImageElement,
  options: {
    brightness: number;
    saturation: number;
    contrast: number;
    rotation: number;
    flipHorizontal: boolean;
  }
): Promise<string> => {
  return new Promise((resolve, reject) => {
    try {
      console.log("Transform Image Options:", {
        imageWidth: sourceImage.width,
        imageHeight: sourceImage.height,
        ...options,
      });

      const canvas = document.createElement("canvas");
      const ctx = canvas.getContext("2d");
      if (!ctx) {
        reject(new Error("Cannot create canvas context"));
        return;
      }

      const isRotated90or270 =
        options.rotation === 90 || options.rotation === 270;
      canvas.width = isRotated90or270 ? sourceImage.height : sourceImage.width;
      canvas.height = isRotated90or270 ? sourceImage.width : sourceImage.height;

      console.log("Canvas Dimensions:", {
        width: canvas.width,
        height: canvas.height,
        isRotated90or270,
      });

      ctx.save();
      ctx.translate(canvas.width / 2, canvas.height / 2);
      ctx.rotate((options.rotation * Math.PI) / 180);

      if (options.flipHorizontal) {
        ctx.scale(-1, 1);
      }

      ctx.filter = `
        brightness(${options.brightness}%) 
        saturate(${options.saturation}%) 
        contrast(${options.contrast}%)
      `;

      console.log("Drawing Image:", {
        sourceWidth: sourceImage.width,
        sourceHeight: sourceImage.height,
      });

      ctx.drawImage(
        sourceImage,
        -sourceImage.width / 2,
        -sourceImage.height / 2
      );

      ctx.restore();

      const dataUrl = canvas.toDataURL("image/png");
      console.log("Transformation Result:", {
        dataUrlLength: dataUrl.length,
      });

      resolve(dataUrl);
    } catch (error) {
      console.error("Transformation Error:", error);
      reject(error);
    }
  });
};
const ImageCropper: React.FC<ImageCropperProps> = ({
  imageUrl,
  aspectRatio,
  onCrop,
  onClose,
}) => {
  const cropperRef = useRef<HTMLImageElement>(null);
  const [filteredImage, setFilteredImage] = useState(imageUrl);
  const [brightness, setBrightness] = useState(100);
  const [saturation, setSaturation] = useState(100);
  const [contrast, setContrast] = useState(100);
  const [flipHorizontal, setFlipHorizontal] = useState(false);
  const [rotation, setRotation] = useState(0);

  const generateFilteredPreview = useCallback(async () => {
    const img = new Image();
    img.crossOrigin = "anonymous";
    img.src = imageUrl;

    img.onload = async () => {
      try {
        const transformedDataUrl = await transformImage(img, {
          brightness,
          saturation,
          contrast,
          rotation,
          flipHorizontal,
        });
        setFilteredImage(transformedDataUrl);
      } catch (error) {
        console.error("Image transformation failed", error);
      }
    };
  }, [brightness, saturation, contrast, rotation, flipHorizontal, imageUrl]);

  useEffect(() => {
    generateFilteredPreview();
  }, [generateFilteredPreview]);

  const getCroppedImage = () => {
    // Step 1: Apply transformations first
    const img = new Image();
    img.crossOrigin = "anonymous";
    img.src = filteredImage; // Use the already transformed image

    img.onload = () => {
      const canvas = document.createElement("canvas");
      const ctx = canvas.getContext("2d");

      // Set canvas dimensions
      canvas.width = img.width;
      canvas.height = img.height;

      // Draw the transformed image
      ctx.drawImage(img, 0, 0);

      // Step 2: Now crop the transformed image
      const cropper = cropperRef.current?.cropper;
      if (!cropper) return;

      const cropData = cropper.getData();

      // Create a new canvas for cropping
      const croppedCanvas = document.createElement("canvas");
      const croppedCtx = croppedCanvas.getContext("2d");

      // Set cropped canvas dimensions
      croppedCanvas.width = cropData.width;
      croppedCanvas.height = cropData.height;

      // Draw the cropped portion
      croppedCtx.drawImage(
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

      // Convert to data URL and pass to onCrop
      onCrop(croppedCanvas.toDataURL("image/png"));
    };
  };

  // Rest of the component remains the same...
  return (
    <div className="fixed inset-0 bg-black bg-opacity-80 flex items-center justify-center z-50">
      <div className="bg-gray-900 text-white rounded-lg shadow-xl w-[95%] max-w-6xl max-h-[90vh] overflow-hidden grid grid-cols-1 md:grid-cols-2">
        {/* Left: Preview Section */}
        <div className="p-6 flex flex-col items-center space-y-4 border-b md:border-b-0 md:border-r border-gray-700">
          <h3 className="text-xl font-semibold">Preview</h3>
          <Cropper
            src={filteredImage}
            style={{ height: 400, width: "100%" }}
            aspectRatio={aspectRatio}
            guides={true}
            ref={cropperRef}
          />
        </div>

        {/* Right: Controls */}
        <div className="p-6 overflow-y-auto space-y-6">
          <h3 className="text-xl font-semibold">Adjustments</h3>
          {/* Filters */}
          {[
            { label: "Brightness", value: brightness, setValue: setBrightness },
            { label: "Saturation", value: saturation, setValue: setSaturation },
            { label: "Contrast", value: contrast, setValue: setContrast },
          ].map(({ label, value, setValue }, idx) => (
            <div key={idx}>
              <label className="block mb-1 text-gray-400">{label}:</label>
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

          {/* Flip and Rotate */}
          <div>
            <label className="block mb-1 text-gray-400">Flip & Rotate:</label>
            <div className="flex items-center space-x-4">
              {/* Flip Horizontal */}
              <button
                onClick={() => setFlipHorizontal(!flipHorizontal)}
                className="py-2 px-4 bg-gray-700 hover:bg-gray-600 rounded-md"
              >
                Flip Horizontal
              </button>

              {/* Rotate Anticlockwise */}
              <button
                onClick={() => setRotation((prev) => (prev - 90 + 360) % 360)}
                className="py-2 px-4 bg-gray-700 hover:bg-gray-600 rounded-md"
              >
                Rotate ⟲
              </button>

              {/* Rotate Clockwise */}
              <button
                onClick={() => setRotation((prev) => (prev + 90) % 360)}
                className="py-2 px-4 bg-gray-700 hover:bg-gray-600 rounded-md"
              >
                Rotate ⟳
              </button>
            </div>
          </div>

          {/* Save and Cancel */}
          <div className="flex justify-between mt-6">
            <button
              onClick={onClose}
              className="py-2 px-4 bg-red-600 hover:bg-red-500 rounded-md"
            >
              Cancel
            </button>
            <button
              onClick={getCroppedImage}
              className="py-2 px-4 bg-blue-600 hover:bg-blue-500 rounded-md"
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
