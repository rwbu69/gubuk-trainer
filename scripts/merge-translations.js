import { readdir, readFile, writeFile } from "fs/promises";
import path from "path";

const ID_TRANSLATED_DIR = path.join(
  process.cwd(),
  "data/extracted/id_translated"
);
const TARGET_DIR = path.join(
  process.cwd(),
  "data/extracted/with_release_en_without_version"
);

async function mergeTranslations() {
  console.log("🔄 Starting translation merge...\n");

  // Get all translated files
  const translatedFiles = await readdir(ID_TRANSLATED_DIR);
  const jsonFiles = translatedFiles.filter((file) => file.endsWith(".json"));

  let processedCount = 0;
  let errorCount = 0;

  for (const filename of jsonFiles) {
    try {
      // Read translated file
      const translatedPath = path.join(ID_TRANSLATED_DIR, filename);
      const translatedContent = await readFile(translatedPath, "utf-8");
      const translatedData = JSON.parse(translatedContent);

      // Read target file
      const targetPath = path.join(TARGET_DIR, filename);
      let targetContent;
      try {
        targetContent = await readFile(targetPath, "utf-8");
      } catch (err) {
        console.log(`⚠️  File not found in target: ${filename}`);
        continue;
      }
      const targetData = JSON.parse(targetContent);

      // Merge translations - preserve all original data, only add/update ID translations
      const mergedData = {
        ...targetData,
      };

      // Add profile translations if they exist
      if (translatedData.profile) {
        mergedData.profile_id = {
          self_intro: translatedData.profile.self_intro || "",
          tagline: translatedData.profile.tagline || "",
          weight: translatedData.profile.weight || "",
          shoes: translatedData.profile.shoes || "",
          dorm: translatedData.profile.dorm || "",
          class: translatedData.profile.class || "",
          ears: translatedData.profile.ears || "",
          tail: translatedData.profile.tail || "",
          strong: translatedData.profile.strong || "",
          weak: translatedData.profile.weak || "",
          family: translatedData.profile.family || "",
          secrets: translatedData.profile.secrets || [],
        };
      }

      // Add title translation
      if (translatedData.title) {
        mergedData.title_id = translatedData.title;
      }

      // Write merged data back
      await writeFile(targetPath, JSON.stringify(mergedData, null, 2));
      processedCount++;
      console.log(`✅ Merged: ${filename}`);
    } catch (err) {
      errorCount++;
      console.error(`❌ Error processing ${filename}:`, err.message);
    }
  }

  console.log(`\n📊 Summary:`);
  console.log(`   Processed: ${processedCount}`);
  console.log(`   Errors: ${errorCount}`);
  console.log(`   Total: ${jsonFiles.length}`);
  console.log(`\n✨ Translation merge complete!`);
}

// Run the merge
mergeTranslations().catch((err) => {
  console.error("Fatal error:", err);
  process.exit(1);
});
