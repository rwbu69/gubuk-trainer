import type { APIRoute } from 'astro';
import { readdir, readFile } from "fs/promises";
import path from "path";

export const GET: APIRoute = async () => {
  const dataDir = path.join(
    process.cwd(),
    "data/extracted/with_release_en_without_version"
  );

  const files = await readdir(dataDir);
  const jsonFiles = files.filter((file) => file.endsWith(".json"));

  const characters = await Promise.all(
    jsonFiles.map(async (file) => {
      const filePath = path.join(dataDir, file);
      const content = await readFile(filePath, "utf-8");
      const data = JSON.parse(content);
      return {
        card_id: data.card_id,
        char_id: data.char_id,
        name_en: data.name_en,
        weight: data.profile?.weight || "N/A",
        ears: data.profile?.ears || "N/A",
        weak: data.profile?.weak || "N/A",
        tail: data.profile?.tail || "N/A",
        strong: data.profile?.strong || "N/A",
        three_sizes: data.charData?.three_sizes
          ? `B${data.charData.three_sizes.b} W${data.charData.three_sizes.w} H${data.charData.three_sizes.h}`
          : "N/A",
        record: data.charData?.rl?.record || "N/A",
        active: data.charData?.rl?.active || "N/A",
        va_en: data.charData?.va_en || "N/A",
        title: data.title || "N/A",
      };
    })
  );

  // Get unique characters by char_id
  const uniqueCharMap = new Map();
  characters.forEach((char) => {
    if (!uniqueCharMap.has(char.char_id)) {
      uniqueCharMap.set(char.char_id, char);
    }
  });
  const uniqueCharacters = Array.from(uniqueCharMap.values());

  return new Response(
    JSON.stringify({
      characters,
      uniqueCharacters,
    }),
    {
      status: 200,
      headers: {
        "Content-Type": "application/json",
      },
    }
  );
};
