import { createClient } from "@supabase/supabase-js";

export async function uploadThumbnail(image: File) {
  const supabaseUrl = process.env.SUPABASE_URL!;
  const supabaseKey = process.env.SUPABASE_API_KEY!;

  const supabase = createClient(supabaseUrl, supabaseKey);

  // Nếu image.name bị undefined thì fallback thành "default.png"
  const fileName = image.name ? image.name.replace(/\s+/g, "_") : "default.png";
  const filePath = `thumbnails/${Date.now()}_${fileName}`;

  const { data, error } = await supabase.storage
    .from("thumbnails")
    .upload(filePath, image, {
      cacheControl: "3600",
      upsert: false,
      contentType: image.type || "image/png",
    });

  if (error) {
    console.error("Upload error:", error.message);
    throw new Error("failed to upload the file");
  }

  const { data: urlData } = supabase.storage
    .from("thumbnails")
    .getPublicUrl(filePath);

  return urlData.publicUrl;
}
