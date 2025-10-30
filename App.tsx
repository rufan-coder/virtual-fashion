import React, { useState, useCallback } from 'react';
import { Header } from './components/Header';
import { ImageUploader } from './components/ImageUploader';
import { ResultDisplay } from './components/ResultDisplay';
import { Footer } from './components/Footer';
import { generateTryOnImage } from './services/geminiService';
import { fileToBase64, getMimeType } from './utils/fileUtils';

const App: React.FC = () => {
  const [modelImage, setModelImage] = useState<File | null>(null);
  const [topImage, setTopImage] = useState<File | null>(null);
  const [bottomImage, setBottomImage] = useState<File | null>(null);
  const [generatedImage, setGeneratedImage] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  const handleTryOn = useCallback(async () => {
    if (!modelImage || (!topImage && !bottomImage)) {
      setError('인물 사진과 함께 상의 또는 하의 이미지를 하나 이상 업로드해주세요.');
      return;
    }

    setIsLoading(true);
    setError(null);
    setGeneratedImage(null);

    try {
      const modelMimeType = getMimeType(modelImage.name);
      if (!modelMimeType) {
        throw new Error('지원되지 않는 인물 사진 형식입니다.');
      }
      const modelBase64 = await fileToBase64(modelImage);

      let topImageData = null;
      if (topImage) {
        const topMimeType = getMimeType(topImage.name);
        if (!topMimeType) throw new Error('지원되지 않는 상의 이미지 형식입니다.');
        const topBase64 = await fileToBase64(topImage);
        topImageData = { data: topBase64, mimeType: topMimeType };
      }

      let bottomImageData = null;
      if (bottomImage) {
        const bottomMimeType = getMimeType(bottomImage.name);
        if (!bottomMimeType) throw new Error('지원되지 않는 하의 이미지 형식입니다.');
        const bottomBase64 = await fileToBase64(bottomImage);
        bottomImageData = { data: bottomBase64, mimeType: bottomMimeType };
      }

      const result = await generateTryOnImage(
        { data: modelBase64, mimeType: modelMimeType },
        topImageData,
        bottomImageData
      );
      
      setGeneratedImage(result);

    } catch (err) {
      console.error(err);
      setError(err instanceof Error ? err.message : '이미지 생성 중 오류가 발생했습니다. 잠시 후 다시 시도해주세요.');
    } finally {
      setIsLoading(false);
    }
  }, [modelImage, topImage, bottomImage]);
  
  const handleRetry = useCallback(() => {
    handleTryOn();
  }, [handleTryOn]);

  return (
    <div className="bg-gray-50 min-h-screen flex flex-col text-gray-800">
      <Header />
      <main className="flex-grow container mx-auto p-4 sm:py-8">
        <div className="max-w-7xl mx-auto grid grid-cols-2 gap-4 md:gap-8 items-start">
          {/* --- INPUT COLUMN --- */}
          <div className="flex flex-col gap-4 md:gap-8">
            <ImageUploader 
              id="model-image"
              title="인물 사진"
              description="피팅할 인물의 전신 사진을 업로드하세요."
              onImageUpload={setModelImage}
              uploadedImage={modelImage}
            />
            
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 md:gap-8">
              <ImageUploader 
                id="top-image"
                title="상의"
                description="착용할 상의 이미지를 업로드하세요."
                onImageUpload={setTopImage}
                uploadedImage={topImage}
              />
              <ImageUploader 
                id="bottom-image"
                title="하의"
                description="착용할 하의 이미지를 업로드하세요."
                onImageUpload={setBottomImage}
                uploadedImage={bottomImage}
              />
            </div>

            <div className="text-center pt-2 md:pt-4">
              <button
                onClick={handleTryOn}
                disabled={!modelImage || (!topImage && !bottomImage) || isLoading}
                className="bg-indigo-600 text-white font-bold py-3 px-8 rounded-full hover:bg-indigo-700 disabled:bg-indigo-300 transition-all duration-300 shadow-lg text-lg w-full sm:w-auto"
              >
                {isLoading ? '생성 중...' : '가상 피팅'}
              </button>
            </div>
          </div>

          {/* --- OUTPUT COLUMN --- */}
          <div className="sticky top-8">
            <ResultDisplay
              isLoading={isLoading}
              generatedImage={generatedImage}
              error={error}
              onRetry={handleRetry}
            />
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default App;