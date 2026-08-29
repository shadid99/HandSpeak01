import { config } from '../config';

export const predictImage = async (imageUri: string) => {
  try {
    const formData = new FormData();
    formData.append('file', {
      uri: imageUri,
      type: 'image/jpeg',
      name: 'photo.jpg',
    } as any);

    const response = await fetch(${config.BASE_URL}/predict, {
      method: 'POST',
      body: formData,
      headers: {
        'Content-Type': 'multipart/form-data',
      },
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
    const response = await fetch(${config.BASE_URL}/text-to-sign, {
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
