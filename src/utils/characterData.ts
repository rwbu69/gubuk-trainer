import { readdir, readFile, writeFile, mkdir } from "fs/promises";
import path from "path";

export interface CharacterData {
  card_id: string;
  char_id: string;
  name_en: string;
  [key: string]: any;
}

export interface CharacterDataResult {
  characters: CharacterData[];
  uniqueCharacters: CharacterData[];
}

interface QuizDataConfig {
  dataDir: string;
  outputFileName: string;
  fields: string[];
  baseUrl: string;
}

/**
 * Generate character data for quiz pages
 * @param config Configuration for data generation
 * @returns Object with characters and uniqueCharacters arrays
 */
export async function generateQuizData(
  config: QuizDataConfig
): Promise<CharacterDataResult> {
  const files = await readdir(config.dataDir);
  const jsonFiles = files.filter((file) => file.endsWith(".json"));

  const characters = await Promise.all(
    jsonFiles.map(async (file) => {
      const filePath = path.join(config.dataDir, file);
      const content = await readFile(filePath, "utf-8");
      const data = JSON.parse(content);

      const character: CharacterData = {
        card_id: data.card_id,
        char_id: data.char_id,
        name_en: data.name_en,
      };

      // Dynamically add fields based on config
      config.fields.forEach((field) => {
        const value = getNestedValue(data, field);
        
        // Extract the final property name (e.g., "weight" from "profile.weight")
        const propertyName = field.split(".").pop() || field;
        
        // Special handling for three_sizes
        if (propertyName === "three_sizes" && value && typeof value === "object") {
          character.three_sizes =
            "B" + value.b + " W" + value.w + " H" + value.h;
        } else if (field === "three_sizes") {
          // Handle direct three_sizes reference (look in charData)
          const threeSizesValue = data.charData?.three_sizes;
          if (threeSizesValue && typeof threeSizesValue === "object") {
            character.three_sizes =
              "B" + threeSizesValue.b + " W" + threeSizesValue.w + " H" + threeSizesValue.h;
          } else {
            character.three_sizes = "N/A";
          }
        } else {
          character[propertyName] = value || "N/A";
        }
      });

      return character;
    })
  );

  // Get unique characters (by char_id) for the dropdown
  const uniqueCharacters = Array.from(
    new Map(characters.map((char) => [char.char_id, char])).values()
  );

  // Find matching images for each unique character
  const imageDir = path.join(process.cwd(), "public/images/character_hd");
  const imageFiles = await readdir(imageDir);

  uniqueCharacters.forEach((char: any) => {
    const matchingImage = imageFiles.find((img) =>
      img.startsWith("hd_" + char.char_id + "_")
    );
    char.imageUrl = matchingImage
      ? config.baseUrl + "/images/character_hd/" + matchingImage
      : null;
  });

  // Write character data to public folder for client-side access
  const publicDataDir = path.join(process.cwd(), "public/data");
  await mkdir(publicDataDir, { recursive: true });
  await writeFile(
    path.join(publicDataDir, config.outputFileName),
    JSON.stringify({ characters, uniqueCharacters }, null, 2)
  );

  return { characters, uniqueCharacters };
}

/**
 * Helper function to get nested object values using dot notation
 * @param obj Object to extract value from
 * @param path Dot-notation path (e.g., "profile.weight" or "charData.rl.record")
 * @returns The value at the path or null
 */
function getNestedValue(obj: any, path: string): any {
  const keys = path.split(".");
  let current = obj;

  for (const key of keys) {
    if (current && typeof current === "object" && key in current) {
      current = current[key];
    } else {
      return null;
    }
  }

  return current;
}

/**
 * Predefined field configurations for common quiz types
 */
export const QuizFieldPresets = {
  standard: [
    "profile.weight",
    "profile.ears",
    "profile.weak",
    "profile.tail",
    "profile.strong",
    "charData.three_sizes",
    "charData.rl.record",
    "charData.rl.active",
    "charData.va_en",
    "title",
    "charData.rl.races",
  ],
  random: [
    "title",
    "profile.tagline",
    "profile.weight",
    "profile.shoes",
    "profile.dorm",
    "profile.class",
    "profile.ears",
    "profile.tail",
    "profile.strong",
    "profile.weak",
    "profile.family",
    "profile.secrets",
    "charData.va_en",
    "charData.three_sizes",
    "charData.rl.country",
    "charData.rl.death",
    "charData.rl.record",
    "charData.rl.earnings",
    "charData.rl.active",
    "release_en",
  ],
};
