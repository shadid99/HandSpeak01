import { config } from '../config';

export const predictImage = async (imageUri: string) => {
  try {
    const formData = new FormData();
    formData.append('file', {
      uri: imageUri,
      type: 'image/jpeg',
      name: 'photo.jpg',
    } as any);

    const response = await fetch(${config.BASE_URL}${config.PREDICTION_ENDPOINT}, {
      method: 'POST',
      body: formData,
      // نترك الهيدر بدون تحديد Content-Type يدوياً لضمان ضبط Boundary الـ FormData تلقائياً
    });

    if (!response.ok) {
      throw new Error(Error status: ${response.status});
    }

    const data = await response.json();
    return data;
  } catch (error) {
    console.error('Error predicting image:', error);
    throw error;
  }
};

export const textToSign = async (text: string) => {
  try {
    const response = await fetch(${config.BASE_URL}${config.TEXT_TO_SIGN_ENDPOINT}, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ text }),
    });

    if (!response.ok) {
      throw new Error(Error status: ${response.status});
    }

    const data = await response.json();
    return data;
  } catch (error) {
    console.error('Error translating text to sign:', error);
    throw error;
  }
};
