import { v2 as cloudinary, type UploadApiResponse } from "cloudinary";
import { writeFileSync } from "fs";
import path from "path";

cloudinary.config({
  cloud_name: "difikt7so",
  api_key: process.env.CLOUDINARY_KEY,
  api_secret: process.env.CLOUDINARY_SECRET,
});

const outputDir = path.join(process.cwd(), "public/text");

const uploadStream = async (
  buffer: Uint8Array,
  options: { folder: string; ocr?: string }
): Promise<UploadApiResponse> => {
  return new Promise((resolve, reject) => {
    cloudinary.uploader
      .upload_stream(options, (error, result) => {
        if (result) return resolve(result);
        reject(error);
      })
      .end(buffer);
  });
};

export async function POST(request: Request) {
  const formData = await request.formData();
  const file = formData.get("file") as File;

  if (!file) return new Response("File not found", { status: 400 });

  const arrayBuffer = await file.arrayBuffer();
  const unit8Array = new Uint8Array(arrayBuffer);

  const result = await uploadStream(unit8Array, {
    folder: "pdf",
    ocr: "adv_ocr",
  });

  const { asset_id: id, secure_url: url, pages, info } = result;

  const data = info?.ocr?.adv_ocr?.data;
  const text = data
    .map((blocks: { textAnnotations: { description: string }[] }) => {
      const annotations = blocks["textAnnotations"] ?? [];
      const first = annotations[0] ?? {};
      const content = first["description"] ?? "";
      return content.trim();
    })
    .filter(Boolean)
    .join("\n");

  // TODO:
  // Meter esta informacion en una base de datos;
  // O mejor todavia en un vector y hacer los embeddings;

  writeFileSync(`${outputDir}/${id}.txt`, text, "utf-8");

  return Response.json({ id, url, pages });
}
