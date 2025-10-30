
import React from 'react';

interface ResultDisplayProps {
  isLoading: boolean;
  generatedImage: string | null;
  error: string | null;
  onReset: () => void;
}

const LoadingSpinner: React.FC = () => (
  <div className="flex flex-col items-center justify-center text-center">
    <div className="w-16 h-16 border-4 border-t-4 border-gray-200 border-t-indigo-600 rounded-full animate-spin"></div>
    <p className="mt-4 text-lg font-semibold text-gray-700">AI가 이미지를 생성하고 있습니다...</p>
    <p className="mt-2 text-sm text-gray-500">잠시만 기다려주세요. 이 과정은 몇 초 정도 소요될 수 있습니다.</p>
  </div>
);

const ErrorDisplay: React.FC<{ message: string; onRetry: () => void; }> = ({ message, onRetry }) => (
    <div className="bg-red-50 border-l-4 border-red-400 p-4 rounded-r-lg text-red-700" role="alert">
        <p className="font-bold">오류 발생</p>
        <p>{message}</p>
        <button onClick={onRetry} className="mt-4 bg-red-600 text-white font-semibold py-2 px-4 rounded-lg hover:bg-red-700 transition">다시 시도</button>
    </div>
);


export const ResultDisplay: React.FC<ResultDisplayProps> = ({ isLoading, generatedImage, error, onReset }) => {
  if (!isLoading && !generatedImage && !error) {
    return null;
  }

  return (
    <div className="bg-white p-6 rounded-2xl shadow-lg mt-8 min-h-[30rem] flex items-center justify-center">
      {isLoading && <LoadingSpinner />}
      {error && !isLoading && <ErrorDisplay message={error} onRetry={onReset} />}
      {generatedImage && !isLoading && (
        <div className="w-full text-center">
            <h2 className="text-2xl font-bold text-gray-800 mb-4">가상 피팅 완료!</h2>
            <div className="max-w-md mx-auto aspect-square bg-gray-100 rounded-xl overflow-hidden shadow-inner">
                <img 
                    src={generatedImage} 
                    alt="Generated try-on" 
                    className="w-full h-full object-contain"
                />
            </div>
            <div className="mt-6">
                <a 
                    href={generatedImage} 
                    download="virtual-try-on.png"
                    className="bg-green-500 text-white font-bold py-3 px-6 rounded-full hover:bg-green-600 transition-colors duration-300 shadow-md inline-block mr-4"
                >
                    이미지 다운로드
                </a>
                <button 
                    onClick={onReset}
                    className="bg-gray-200 text-gray-700 font-bold py-3 px-6 rounded-full hover:bg-gray-300 transition-colors duration-300"
                >
                    다시하기
                </button>
            </div>
        </div>
      )}
    </div>
  );
};
