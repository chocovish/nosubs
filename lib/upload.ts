'use server';

import { writeFile, mkdir } from 'fs/promises';
import { join } from 'path';
import { v4 as uuidv4 } from 'uuid';

type UploadResult = {
  fileUrl: string;
  fileName: string;
};

export async function uploadFile(file: File, folder: 'thumbnails' | 'products'): Promise<UploadResult> {
  const bytes = await file.arrayBuffer();
  const buffer = Buffer.from(bytes);

  // Create a unique file name
  const uniqueId = uuidv4();
  const fileExtension = file.name.split('.').pop();
  const fileName = `${uniqueId}.${fileExtension}`;

  // Define the upload directory path
  const uploadDir = join(process.cwd(), 'public', 'uploads', folder);
  const filePath = join(uploadDir, fileName);

  // Ensure the directory exists
  await ensureDir(uploadDir);

  // Write the file
  await writeFile(filePath, buffer);

  // Return the public URL
  return {
    fileUrl: `/uploads/${folder}/${fileName}`,
    fileName
  };
}

async function ensureDir(dirPath: string) {
  try {
    await mkdir(dirPath, { recursive: true });
  } catch (error) {
    if ((error as NodeJS.ErrnoException).code !== 'EEXIST') {
      throw error;
    }
  }
}