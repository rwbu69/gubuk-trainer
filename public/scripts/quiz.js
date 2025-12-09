import { CharacterQuiz } from './modules/CharacterQuiz.js';

// Get the base path from the current script location
const scriptPath = new URL(import.meta.url).pathname;
const basePath = scriptPath.includes('/gubuk-trainer/') ? '/gubuk-trainer' : '';

// Fetch character data from static JSON file (works with GitHub Pages)
fetch(`${basePath}/data/characters-en.json`)
  .then(response => response.json())
  .then(data => {
    const quiz = new CharacterQuiz(data.characters, data.uniqueCharacters);
    quiz.init();
  })
  .catch(error => {
    console.error('Failed to load character data:', error);
  });
