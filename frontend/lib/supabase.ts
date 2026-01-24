
import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || '';
const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || '';

if (!supabaseUrl || !supabaseKey) {
  console.warn('Supabase URL or Key is missing! Supabase client will not be initialized.');
}

export const supabase = (supabaseUrl && supabaseKey) 
  ? createClient(supabaseUrl, supabaseKey) 
  : null as any;

export async function uploadImage(buffer: Buffer, fileName: string, mimeType: string) {
  const bucketName = 'issues';
  
  try {
    // Supabase bazen doğrudan Node Buffer yerine Uint8Array tercih edebilir
    const fileData = new Uint8Array(buffer);

    const { data, error } = await supabase.storage
      .from(bucketName)
      .upload(fileName, fileData, {
        contentType: mimeType,
        upsert: true
      });

    if (error) {
      console.error('Supabase Storage Error Details:', error);
      throw error;
    }

    const { data: { publicUrl } } = supabase.storage
      .from(bucketName)
      .getPublicUrl(fileName);

    console.log('Successfully uploaded to Supabase:', publicUrl);
    return publicUrl;
  } catch (err) {
    console.error('uploadImage unexpected error:', err);
    throw err;
  }
}


