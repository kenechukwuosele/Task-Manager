import React, { useRef, useEffect, useState } from "react";

const ProfilePhotoSelector = ({ image, setImage }) => {
  const inputRef = useRef(null);
  const [preview, setPreview] = useState(null);

  // Update preview whenever `image` changes
  useEffect(() => {
    if (!image) {
      setPreview(null);
      return;
    }

    const objectUrl = URL.createObjectURL(image);
    setPreview(objectUrl);

    // Cleanup the old object URL when component unmounts or image changes
    return () => URL.revokeObjectURL(objectUrl);
  }, [image]);

  const onChooseFile = () => {
    if (inputRef.current) {
      inputRef.current.click(); // Correct usage
    }
  };

  const handleChange = (e) => {
    if (e.target.files && e.target.files[0]) {
      setImage(e.target.files[0]);
    }
  };

  return (
    <div className="flex flex-col items-center mb-4">
      <div
        className="w-24 h-24 rounded-full border border-gray-300 flex items-center justify-center cursor-pointer overflow-hidden"
        onClick={onChooseFile}
      >
        {preview ? (
          <img
            src={preview}
            alt="Profile"
            className="w-full h-full object-cover"
          />
        ) : (
          <span className="text-gray-400">Upload</span> // Keep your icon here if needed
        )}
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
