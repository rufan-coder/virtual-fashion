
import React from 'react';

const SparkleIcon: React.FC<{className?: string}> = ({ className }) => (
    <svg className={className} xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor">
        <path d="M12 .5l2.121 5.303 5.303 2.121-5.303 2.121L12 15.348l-2.121-5.303L4.576 7.924l5.303-2.121L12 .5zm0 23l-2.121-5.303-5.303-2.121 5.303-2.121L12 8.652l2.121 5.303 5.303 2.121-5.303 2.121L12 23.5zM20.424 4.576l-1.414 3.535-3.535 1.414 3.535 1.414 1.414 3.535 1.414-3.535 3.535-1.414-3.535-1.414-1.414-3.535z" />
    </svg>
);


export const Header: React.FC = () => {
  return (
    <header className="bg-white shadow-md">
      <div className="container mx-auto px-4 py-6 text-center">
        <h1 className="text-3xl md:text-4xl font-bold text-indigo-600 flex items-center justify-center gap-3">
          <SparkleIcon className="w-8 h-8 text-yellow-400" />
          AI 가상 패션 피팅룸
          <SparkleIcon className="w-8 h-8 text-yellow-400" />
        </h1>
        <p className="mt-2 text-md text-gray-600">
          Gemini AI를 사용하여 사진 속 인물에게 옷을 입혀보세요.
        </p>
      </div>
    </header>
  );
};
