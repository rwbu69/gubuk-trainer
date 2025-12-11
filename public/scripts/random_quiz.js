import { CharacterRandomQuiz } from './modules/CharacterRandomQuiz.js';

const scriptPath = new URL(import.meta.url).pathname;
const basePath = scriptPath.includes('/gubuk-trainer/') ? '/gubuk-trainer' : '';

fetch(`${basePath}/data/characters-random-en.json`)
  .then(response => response.json())
  .then(data => {
    const quiz = new CharacterRandomQuiz(data.characters, data.uniqueCharacters);
    quiz.init();
  })
  .catch(error => {
    console.error('Failed to load character data:', error);
  });
