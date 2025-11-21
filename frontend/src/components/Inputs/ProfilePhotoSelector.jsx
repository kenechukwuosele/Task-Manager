import React, { useRef, useEffect, useState } from "react";
import { LuUser, LuCamera } from "react-icons/lu";

const ProfilePhotoSelector = ({ image, setImage, currentImage }) => {
  const inputRef = useRef(null);
  const [preview, setPreview] = useState(null);

  // Update preview whenever `image` changes
  useEffect(() => {
    if (image) {
      const objectUrl = URL.createObjectURL(image);
      setPreview(objectUrl);
      // Cleanup the old object URL when component unmounts or image changes
      return () => URL.revokeObjectURL(objectUrl);
    } else if (currentImage) {
      setPreview(currentImage);
    } else {
      setPreview(null);
    }
  }, [image, currentImage]);

  const onChooseFile = () => {
    if (inputRef.current) {
      inputRef.current.click();
    }
  };

  const handleChange = (e) => {
    if (e.target.files && e.target.files[0]) {
      setImage(e.target.files[0]);
    }
  };

  return (
    <div className="flex flex-col items-center mb-4 group">
      <div
        className="w-28 h-28 rounded-full border-4 border-white shadow-lg flex items-center justify-center cursor-pointer overflow-hidden bg-slate-100 relative transition-transform hover:scale-105"
        onClick={onChooseFile}
      >
        {preview ? (
          <img
            src={preview}
            alt="Profile"
            className="w-full h-full object-cover"
          />
        ) : (
          <LuUser className="text-slate-400 w-12 h-12" />
        )}

        {/* Overlay on hover */}
        <div className="absolute inset-0 bg-black/30 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
          <LuCamera className="text-white w-8 h-8" />
        </div>
      </div>
      <input
        type="file"
        accept="image/*"
        ref={inputRef}
        className="hidden"
        onChange={handleChange}
      />
    </div>
  );
};

export default ProfilePhotoSelector;
