export type CloudinaryUploadResult = {
  url: string;
  publicId: string;
  width: number;
  height: number;
};

/** Uploads a file straight from the browser to Cloudinary using an unsigned
 * upload preset — no server round-trip, no API secret involved (unsigned
 * uploads only ever need the cloud name + preset, both safe to expose). */
export async function uploadToCloudinary(file: File): Promise<CloudinaryUploadResult> {
  const cloudName = process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME;
  const uploadPreset = process.env.NEXT_PUBLIC_CLOUDINARY_UPLOAD_PRESET;

  if (!cloudName || !uploadPreset) {
    throw new Error("Cloudinary isn't configured — see .env.local.example.");
  }

  const formData = new FormData();
  formData.append("file", file);
  formData.append("upload_preset", uploadPreset);

  const response = await fetch(
    `https://api.cloudinary.com/v1_1/${cloudName}/image/upload`,
    { method: "POST", body: formData }
  );

  if (!response.ok) {
    throw new Error(
      "Upload failed — check that the upload preset is set to Unsigned in your Cloudinary settings."
    );
  }

  const data = await response.json();
  return {
    url: data.secure_url as string,
    publicId: data.public_id as string,
    width: data.width as number,
    height: data.height as number,
  };
}
