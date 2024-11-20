// import GridMaker from "@/app/components/GridMaker";
// import ImageEditor from "./components/ImageEditor";

// export default function Home() {
//   return (
//     <div className="container mx-auto px-4 py-8">
//       <div className="flex items-center mb-8">
//         <img src="/Logo.png" alt="Logo" className="h-12 w-12" />
//         <h1 className="text-4xl font-bold ml-4">Framework</h1>
//       </div>
//       <GridMaker />
//     </div>
//   );
// }
"use client";

import { useState } from "react";
import GridMaker from "@/app/components/GridMaker";
import ImageEditorr from "./components/ImageEditorr";

export default function Home() {
  const [isEditing, setIsEditing] = useState(false);
  const [imageUrl, setImageUrl] = useState(
    "https://via.placeholder.com/800x600"
  ); // Placeholder image URL

  const handleSave = (editedImageUrl: string) => {
    console.log("Edited image saved:", editedImageUrl);
    setIsEditing(false);
  };

  const handleOpenEditor = () => {
    setIsEditing(true);
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="flex items-center mb-8">
        <img src="/Logo.png" alt="Logo" className="h-12 w-12" />
        <h1 className="text-4xl font-bold ml-4">Framework</h1>
      </div>

      <GridMaker />

      {/* <div className="mt-8">
        <button
          className="bg-blue-500 text-white px-4 py-2 rounded shadow"
          onClick={handleOpenEditor}
        >
          Edit Image
        </button>
      </div>

      {isEditing && (
        <ImageEditorr
          imageUrl={imageUrl}
          onSave={handleSave}
          onClose={() => setIsEditing(false)}
        />
      )} */}
    </div>
  );
}
