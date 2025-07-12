// utils/cloudinaryUpload.ts
import { cloudinaryConfig } from '@/config/cloudinary';
import * as FileSystem from 'expo-file-system';
import { Platform } from 'react-native';

export const uploadToCloudinary = async (uri: string): Promise<string> => {
  let file: any;
  if (Platform.OS === 'web') {
    const resp = await fetch(uri);
    file = await resp.blob();
  } else {
    const b64 = await FileSystem.readAsStringAsync(uri, {
      encoding: FileSystem.EncodingType.Base64,
    });
    file = `data:image/jpeg;base64,${b64}`;
  }

  const form = new FormData();
  form.append('file', file);
  form.append('upload_preset', cloudinaryConfig.uploadPreset);
  form.append('folder', cloudinaryConfig.folder);

  const res = await fetch(
    `https://api.cloudinary.com/v1_1/${cloudinaryConfig.cloudName}/upload`,
    { method: 'POST', body: form }
  );
  if (!res.ok) throw new Error('Cloudinary upload failed');
  const data = await res.json();
  return data.secure_url;
};
