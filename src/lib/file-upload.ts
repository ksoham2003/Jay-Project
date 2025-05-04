export async function uploadFile(file: File): Promise<string> {
  const formData = new FormData();
  formData.append('file', file);
  formData.append('upload_preset', 'faculty_sar'); // Create this in Cloudinary

  try {
    const response = await fetch(
      `https://api.cloudinary.com/v1_1/YOUR_CLOUD_NAME/upload`,
      {
        method: 'POST',
        body: formData,
      }
    );

    if (!response.ok) {
      throw new Error('File upload failed');
    }

    const data = await response.json();
    return data.secure_url;
  } catch (error) {
    console.error('Upload error:', error);
    throw error;
  }
}

export async function uploadFiles(files: FileList | null): Promise<string[]> {
  if (!files || files.length === 0) return [];

  const uploadPromises = Array.from(files).map(file => {
    if (!validateFile(file)) {
      throw new Error(`Invalid file type or size: ${file.name}`);
    }
    return uploadFile(file);
  });

  return Promise.all(uploadPromises);
}

export function validateFile(file: File, maxSizeMB = 5): boolean {
  const validTypes = [
    'application/pdf',
    'image/jpeg',
    'image/png',
    'application/msword',
    'application/vnd.openxmlformats-officedocument.wordprocessingml.document'
  ];
  
  return (
    file.size <= maxSizeMB * 1024 * 1024 && 
    validTypes.includes(file.type)
  );
}