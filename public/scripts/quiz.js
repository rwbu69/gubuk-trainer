import { CharacterQuiz } from './modules/CharacterQuiz.js';

// Fetch character data from static JSON file (works with GitHub Pages)
fetch('/data/characters-en.json')
  .then(response => response.json())
  .then(data => {
    const quiz = new CharacterQuiz(data.characters, data.uniqueCharacters);
    quiz.init();
  })
  .catch(error => {
    console.error('Failed to load character data:', error);
  });
