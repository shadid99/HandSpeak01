import api from './api';
import { config } from '../config';
import { TranslationResult, ApiError } from '../types';

export const translateImage = async (imageUri: string): Promise<TranslationResult> => {
  const formData = new FormData();

  formData.append('file', {
    uri: imageUri,
    name: 'frame.jpg',
    type: 'image/jpeg',
  } as any);

  console.log('IMAGE URI:', imageUri);
  console.log('Sending image to backend...');

  const response = await api.post(
      '/predict',
      formData,
      {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      }
  );

  return {
    label: response.data.label,
    confidence: response.data.confidence,
  };
};
