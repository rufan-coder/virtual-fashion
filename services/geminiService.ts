import { GoogleGenAI, Modality } from '@google/genai';

interface ImageData {
  data: string;
  mimeType: string;
}

const ai = new GoogleGenAI({ apiKey: process.env.API_KEY as string });

export async function generateTryOnImage(
  modelImage: ImageData, 
  topImage: ImageData | null, 
  bottomImage: ImageData | null
): Promise<string> {
  if (!topImage && !bottomImage) {
    throw new Error('상의 또는 하의 이미지가 하나 이상 필요합니다.');
  }

  try {
    const parts: any[] = [
      {
        inlineData: {
          data: modelImage.data,
          mimeType: modelImage.mimeType,
        },
      },
    ];

    if (topImage) {
      parts.push({
        inlineData: {
          data: topImage.data,
          mimeType: topImage.mimeType,
        },
      });
    }
    
    if (bottomImage) {
      parts.push({
        inlineData: {
          data: bottomImage.data,
          mimeType: bottomImage.mimeType,
        },
      });
    }

    let promptText = '사진 속 인물에게';
    if (topImage && bottomImage) {
      promptText += ' 이 상의와 하의를';
    } else if (topImage) {
      promptText += ' 이 상의를';
    } else if (bottomImage) {
      promptText += ' 이 하의를';
    }
    promptText += ' 자연스럽게 입혀줘. 배경은 원래 사진의 배경을 유지하고, 인물의 얼굴과 포즈는 그대로 유지해줘.';

    parts.push({ text: promptText });


    const response = await ai.models.generateContent({
      model: 'gemini-2.5-flash-image',
      contents: { parts },
      config: {
        responseModalities: [Modality.IMAGE],
      },
    });

    for (const part of response.candidates?.[0]?.content?.parts || []) {
        if (part.inlineData) {
            const base64ImageBytes: string = part.inlineData.data;
            const imageUrl = `data:${part.inlineData.mimeType};base64,${base64ImageBytes}`;
            return imageUrl;
        }
    }
    
    throw new Error('AI가 이미지를 생성하지 못했습니다. 다른 이미지를 사용해보세요.');

  } catch (error) {
    console.error('Error generating image with Gemini:', error);
    if (error instanceof Error && error.message.includes('API_KEY')) {
        throw new Error('API 키 설정이 올바르지 않습니다.');
    }
    throw new Error('이미지 생성에 실패했습니다. 입력 이미지를 확인하거나 나중에 다시 시도해주세요.');
  }
}