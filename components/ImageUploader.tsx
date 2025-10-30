
import React, { useCallback, useState, useRef } from 'react';

interface ImageUploaderProps {
  id: string;
  title: string;
  description: string;
  onImageUpload: (file: File) => void;
  uploadedImage: File | null;
}

const UploadIcon: React.FC<{className?: string}> = ({ className }) => (
    <svg className={className} xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" d="M3 16.5v2.25A2.25 2.25 0 005.25 21h13.5A2.25 2.25 0 0021 18.75V16.5m-13.5-9L12 3m0 0l4.5 4.5M12 3v13.5" />
    </svg>
);


export const ImageUploader: React.FC<ImageUploaderProps> = ({ id, title, description, onImageUpload, uploadedImage }) => {
  const [isDragging, setIsDragging] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    if (event.target.files && event.target.files[0]) {
      onImageUpload(event.target.files[0]);
    }
  };

  const handleDrop = useCallback((event: React.DragEvent<HTMLLabelElement>) => {
    event.preventDefault();
    event.stopPropagation();
    setIsDragging(false);
    if (event.dataTransfer.files && event.dataTransfer.files[0]) {
      onImageUpload(event.dataTransfer.files[0]);
    }
  }, [onImageUpload]);

  const handleDragOver = (event: React.DragEvent<HTMLLabelElement>) => {
    event.preventDefault();
    event.stopPropagation();
  };

  const handleDragEnter = (event: React.DragEvent<HTMLLabelElement>) => {
    event.preventDefault();
    event.stopPropagation();
    setIsDragging(true);
  };

  const handleDragLeave = (event: React.DragEvent<HTMLLabelElement>) => {
    event.preventDefault();
    event.stopPropagation();
    setIsDragging(false);
  };
  
  const handleButtonClick = () => {
    fileInputRef.current?.click();
  };


  return (
    <div className="bg-white p-6 rounded-2xl shadow-lg h-full flex flex-col">
      <h2 className="text-xl font-bold text-gray-800 mb-2">{title}</h2>
      <p className="text-sm text-gray-500 mb-4">{description}</p>
      
      <div className="flex-grow flex items-center justify-center">
        {!uploadedImage ? (
           <label
           htmlFor={id}
           onDrop={handleDrop}
           onDragOver={handleDragOver}
           onDragEnter={handleDragEnter}
           onDragLeave={handleDragLeave}
           className={`w-full h-64 border-2 border-dashed rounded-xl flex flex-col justify-center items-center cursor-pointer transition-colors duration-200 ${isDragging ? 'border-indigo-600 bg-indigo-50' : 'border-gray-300 hover:border-indigo-400 hover:bg-gray-50'}`}
         >
           <UploadIcon className="w-10 h-10 text-gray-400 mb-3" />
           <span className="text-gray-600 font-medium">드래그 앤 드롭 또는 클릭</span>
           <span className="text-xs text-gray-500 mt-1">이미지 파일을 선택하세요</span>
           <input
             id={id}
             type="file"
             accept="image/png, image/jpeg, image/webp"
             className="hidden"
             onChange={handleFileChange}
             ref={fileInputRef}
           />
         </label>
        ) : (
          <div className="w-full h-64 relative group">
            <img 
              src={URL.createObjectURL(uploadedImage)} 
              alt="Uploaded preview" 
              className="w-full h-full object-contain rounded-xl"
            />
            <div className="absolute inset-0 bg-black bg-opacity-50 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-300 rounded-xl">
              <button 
                onClick={handleButtonClick}
                className="bg-white text-gray-800 font-semibold py-2 px-4 rounded-lg shadow-md hover:bg-gray-100 transition"
              >
                이미지 변경
              </button>
               <input
                id={`${id}-reupload`}
                type="file"
                accept="image/png, image/jpeg, image/webp"
                className="hidden"
                onChange={handleFileChange}
                ref={fileInputRef}
              />
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
