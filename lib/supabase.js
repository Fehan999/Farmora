import { createClient } from "@supabase/supabase-js";

const url = process.env.NEXT_PUBLIC_SUPABASE_URL || "https://oizvvkygpziyphqrfllh.supabase.co";
const key = process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY || "sb_publishable_Lffe7QmJNX1fb6NO_Fi2dA_rW_KQLK8";
export const BUCKET = process.env.NEXT_PUBLIC_SUPABASE_BUCKET || "farmora";

export const supabase = createClient(url, key);

export async function uploadImage(file, folder = "products") {
  const ext = file.name.split(".").pop();
  const path = `${folder}/${Date.now()}-${Math.random().toString(36).slice(2, 8)}.${ext}`;
  const { error } = await supabase.storage.from(BUCKET).upload(path, file, {
    cacheControl: "3600",
    upsert: false,
  });
  if (error) throw error;
  const { data } = supabase.storage.from(BUCKET).getPublicUrl(path);
  return data.publicUrl;
}
