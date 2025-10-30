import React from 'react';

interface ResultDisplayProps {
  isLoading: boolean;
  generatedImage: string | null;
  error: string | null;
  onRetry: () => void;
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

const InitialState: React.FC = () => (
    <div className="flex flex-col items-center justify-center text-center text-gray-500 h-full">
        <svg className="w-20 h-20 mb-4 text-gray-300" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" d="M9.813 15.904L9 18.75l-.813-2.846a4.5 4.5 0 00-3.09-3.09L2.25 12l2.846-.813a4.5 4.5 0 003.09-3.09L9 5.25l.813 2.846a4.5 4.5 0 003.09 3.09L15.75 12l-2.846.813a4.5 4.5 0 00-3.09 3.09zM18.259 8.715L18 9.75l-.259-1.035a3.375 3.375 0 00-2.455-2.456L14.25 6l1.036-.259a3.375 3.375 0 002.455-2.456L18 2.25l.259 1.035a3.375 3.375 0 002.456 2.456L21.75 6l-1.035.259a3.375 3.375 0 00-2.456 2.456zM16.898 20.562L16.25 22.25l-.648-1.688a1.875 1.875 0 01-1.423-1.423L12.5 18.5l1.688-.648a1.875 1.875 0 011.423-1.423L17.25 15.75l.648 1.688a1.875 1.875 0 011.423 1.423L21 19.5l-1.688.648a1.875 1.875 0 01-1.423 1.423z" />
        </svg>
        <h3 className="text-xl font-semibold mb-2 text-gray-700">결과 표시 영역</h3>
        <p>인물과 옷 사진을 업로드하고<br />'가상 피팅'을 누르면<br />결과가 여기에 표시됩니다.</p>
    </div>
);

const GeneratedResult: React.FC<{ image: string; onRetry: () => void; }> = ({ image, onRetry }) => (
    <div className="w-full text-center">
        <h2 className="text-2xl font-bold text-gray-800 mb-4">가상 피팅 완료!</h2>
        <div className="max-w-md mx-auto aspect-square bg-gray-100 rounded-xl overflow-hidden shadow-inner">
            <img 
                src={image} 
                alt="Generated try-on" 
                className="w-full h-full object-contain"
            />
        </div>
        <div className="mt-6">
            <a 
                href={image} 
                download="virtual-try-on.png"
                className="bg-green-500 text-white font-bold py-3 px-6 rounded-full hover:bg-green-600 transition-colors duration-300 shadow-md inline-block mr-4"
            >
                이미지 다운로드
            </a>
            <button 
                onClick={onRetry}
                className="bg-gray-200 text-gray-700 font-bold py-3 px-6 rounded-full hover:bg-gray-300 transition-colors duration-300"
            >
                다시하기
            </button>
        </div>
    </div>
);


export const ResultDisplay: React.FC<ResultDisplayProps> = ({ isLoading, generatedImage, error, onRetry }) => {

    const renderContent = () => {
        if (isLoading) {
            return <LoadingSpinner />;
        }
        if (error) {
            return <ErrorDisplay message={error} onRetry={onRetry} />;
        }
        if (generatedImage) {
            return <GeneratedResult image={generatedImage} onRetry={onRetry} />;
        }
        return <InitialState />;
    };

    return (
        <div className="bg-white p-6 rounded-2xl shadow-lg min-h-[30rem] flex items-center justify-center">
            {renderContent()}
        </div>
    );
};