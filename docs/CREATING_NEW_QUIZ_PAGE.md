# Creating a New Quiz Page

This guide shows you how to create a new quiz page using the modular utilities.

## Quick Start

### 1. Create a new quiz page

```astro
---
import QuizLayout from "../layouts/QuizLayout.astro";
import CharacterList from "../components/CharacterList.astro";
import { generateQuizData, QuizFieldPresets } from "../utils/characterData";

// Generate character data with predefined fields
const { uniqueCharacters } = await generateQuizData({
  outputFileName: "your-quiz-data.json",  // Output JSON file name
  fields: QuizFieldPresets.standard,       // Use predefined field set
  baseUrl: import.meta.env.BASE_URL,
});
---

<QuizLayout
  title="Your Quiz Title"
  subtitle="Your subtitle"
  scriptSrc={`${import.meta.env.BASE_URL}/scripts/your_quiz.js`}
>
  <div slot="character-list">
    <CharacterList
      characters={uniqueCharacters}
      baseUrl={import.meta.env.BASE_URL}
    />
  </div>
</QuizLayout>
```

### 2. Custom Field Configuration

If you need custom fields instead of presets:

```astro
const { uniqueCharacters } = await generateQuizData({
  outputFileName: "custom-quiz-data.json",
  fields: [
    "title",
    "profile.weight",
    "profile.ears",
    "charData.va_en",
    "charData.rl.record",
    // Add any field using dot notation
  ],
  baseUrl: import.meta.env.BASE_URL,
});
```

### 3. Custom Data Directory

If your data is in a different location:

```astro
const { uniqueCharacters } = await generateQuizData({
  dataDir: path.join(process.cwd(), "data/custom/path"),
  outputFileName: "quiz-data.json",
  fields: QuizFieldPresets.standard,
  baseUrl: import.meta.env.BASE_URL,
});
```

## Available Field Presets

### `QuizFieldPresets.standard`
Perfect for standard character quiz:
- `profile.weight`
- `profile.ears`
- `profile.weak`
- `profile.tail`
- `profile.strong`
- `three_sizes`
- `charData.rl.record`
- `charData.rl.active`
- `charData.va_en`
- `title`
- `charData.rl.races`

### `QuizFieldPresets.random`
Extended quiz with more fields:
- All standard fields plus:
- `profile.tagline`
- `profile.shoes`
- `profile.dorm`
- `profile.class`
- `profile.family`
- `profile.secrets`
- `charData.rl.country`
- `charData.rl.death`
- `charData.rl.earnings`
- `release_en`

## Using Alternative Layouts

### QuizNewLayout (with animations)

```astro
import QuizNewLayout from "../layouts/QuizNewLayout.astro";

<QuizNewLayout
  title="Animated Quiz"
  scriptSrc={`${import.meta.env.BASE_URL}/scripts/your_quiz.js`}
>
  <div slot="character-list">
    <CharacterList
      characters={uniqueCharacters}
      baseUrl={import.meta.env.BASE_URL}
    />
  </div>
</QuizNewLayout>
```

## Complete Example

Here's a complete example for a new "Ultimate Quiz" page:

**File: `src/pages/ultimate_quiz_en.astro`**

```astro
---
import QuizLayout from "../layouts/QuizLayout.astro";
import CharacterList from "../components/CharacterList.astro";
import { generateQuizData } from "../utils/characterData";

const { uniqueCharacters } = await generateQuizData({
  outputFileName: "ultimate-quiz-en.json",
  fields: [
    "title",
    "profile.tagline",
    "profile.weight",
    "profile.ears",
    "profile.tail",
    "profile.strong",
    "profile.weak",
    "profile.family",
    "three_sizes",
    "charData.va_en",
    "charData.rl.record",
    "charData.rl.active",
    "charData.rl.country",
    "charData.rl.races",
  ],
  baseUrl: import.meta.env.BASE_URL,
});
---

<QuizLayout
  title="Ultimate Character Quiz"
  subtitle="The most comprehensive character quiz"
  scriptSrc={`${import.meta.env.BASE_URL}/scripts/ultimate_quiz.js`}
>
  <div slot="character-list">
    <CharacterList
      characters={uniqueCharacters}
      baseUrl={import.meta.env.BASE_URL}
    />
  </div>
</QuizLayout>
```

## Benefits

✅ **Reusable**: Single utility function for all quiz pages  
✅ **Maintainable**: Change data processing logic in one place  
✅ **Type-safe**: TypeScript support with proper types  
✅ **Flexible**: Easy to customize fields and configuration  
✅ **DRY**: No code duplication across pages  

## Tips

- Use `QuizFieldPresets` for common configurations
- Create custom presets if you have multiple pages with same fields
- The `outputFileName` should be unique per quiz type
- Field paths use dot notation: `"object.nested.property"`
- Special handling for `three_sizes` field (automatically formatted)
