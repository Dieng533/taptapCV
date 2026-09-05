import { createClient } from "./client";

const BUCKET_NAME = "resume-photos";

export async function uploadPhoto(file: File, userId: string): Promise<string> {
  const supabase = createClient();
  
  // Generate unique filename
  const fileExt = file.name.split('.').pop();
  const fileName = `${userId}/${Date.now()}.${fileExt}`;
  
  const { data, error } = await supabase.storage
    .from(BUCKET_NAME)
    .upload(fileName, file, {
      upsert: true,
      contentType: file.type,
    });

  if (error) {
    throw new Error(`Failed to upload photo: ${error.message}`);
  }

  // Get public URL
  const { data: { publicUrl } } = supabase.storage
    .from(BUCKET_NAME)
    .getPublicUrl(fileName);

  return publicUrl;
}

export async function deletePhoto(photoUrl: string): Promise<void> {
  const supabase = createClient();
  
  // Extract filename from URL
  const url = new URL(photoUrl);
  const pathParts = url.pathname.split('/');
  const fileName = pathParts[pathParts.length - 2] + '/' + pathParts[pathParts.length - 1];
  
  const { error } = await supabase.storage
    .from(BUCKET_NAME)
    .remove([fileName]);

  if (error) {
    console.error('Failed to delete photo:', error);
  }
}
