export class CharacterRandomQuiz {
  constructor(characters, uniqueCharacters) {
    this.characters = characters;
    this.uniqueCharacters = uniqueCharacters;
    
    // All available question fields
    this.allPossibleQuestions = [
      { key: "title", title: "Title" },
      { key: "tagline", title: "Tagline" },
      { key: "weight", title: "Trivia tentang Berat Badan" },
      { key: "shoes", title: "Trivia tentang Sepatu" },
      { key: "dorm", title: "Asrama" },
      { key: "class", title: "Kelas" },
      { key: "ears", title: "Trivia tentang Telinga" },
      { key: "tail", title: "Trivia tentang Ekor" },
      { key: "strong", title: "Kelebihan" },
      { key: "weak", title: "Kekurangan" },
      { key: "family", title: "Trivia tentang Keluarga" },
      { key: "secrets", title: "Rahasia" },
      { key: "va_en", title: "Pengisi Suara (EN)" },
      { key: "three_sizes", title: "Ukuran Tubuh" },
      { key: "country", title: "Negara" },
      { key: "death", title: "Tanggal Meninggal" },
      { key: "record", title: "Rekor Balapan" },
      { key: "earnings", title: "Pendapatan (dalam Yen)" },
      { key: "active", title: "Tahun Aktif" },
      { key: "release_en", title: "Tanggal Rilis EN" },
    ];
    
    this.questions = [];
    this.revealedClues = 0;
    this.currentAnswer = null;
    this.gameEnded = false;
  }

  init() {
    this.selectRandomCharacter();
    this.selectRandomQuestions();
    this.initializeClues();
    this.attachEventListeners();
  }

  selectRandomCharacter() {
    const randomIndex = Math.floor(Math.random() * this.characters.length);
    this.currentAnswer = this.characters[randomIndex];
    console.log("Answer:", this.currentAnswer.name_en);
  }

  selectRandomQuestions() {
    // Shuffle and pick 10 random questions
    const shuffled = [...this.allPossibleQuestions].sort(() => Math.random() - 0.5);
    this.questions = shuffled.slice(0, 10);
  }

  initializeClues() {
    const container = document.getElementById("clues-container");
    container.innerHTML = "";

    this.questions.forEach((question, index) => {
      const answer = this.currentAnswer[question.key];
      const clueDiv = document.createElement("div");
      clueDiv.className = `clue-item bg-white/5 rounded-lg p-4 border-2 border-white/20 transition-all duration-500`;
      clueDiv.id = `clue-${index}`;

      if (index === 0) {
        clueDiv.innerHTML = `
          <div class="flex items-center gap-4">
            <div class="flex-1">
              <h4 class="text-lg font-semibold text-white mb-1">${question.title}</h4>
              <p class="text-gray-300">${answer}</p>
            </div>
            <div class="text-sm text-purple-300 font-semibold">Petunjuk ${index + 1}</div>
          </div>
        `;
        clueDiv.classList.add("border-purple-400");
      } else {
        clueDiv.innerHTML = `
          <div class="flex items-center gap-4">
            <div class="flex-1 space-y-2">
              <div class="h-5 bg-white/20 rounded w-1/4 animate-pulse"></div>
              <div class="h-4 bg-white/20 rounded w-3/4 animate-pulse"></div>
            </div>
            <div class="w-12 h-4 bg-white/20 rounded animate-pulse"></div>
          </div>
        `;
      }

      container.appendChild(clueDiv);
    });

    this.revealedClues = 1;
    this.updateProgress();
  }

  revealNextClue() {
    if (this.revealedClues < this.questions.length) {
      const question = this.questions[this.revealedClues];
      const answer = this.currentAnswer[question.key];
      const nextClue = document.getElementById(`clue-${this.revealedClues}`);

      nextClue.innerHTML = `
        <div class="flex items-center gap-4">
          <div class="flex-1">
            <h4 class="text-lg font-semibold text-white mb-1">${question.title}</h4>
            <p class="text-gray-300">${answer}</p>
          </div>
          <div class="text-sm text-purple-300 font-semibold">Petunjuk ${this.revealedClues + 1}</div>
        </div>
      `;
      nextClue.classList.remove("opacity-40");
      nextClue.classList.add("border-purple-400");
      this.revealedClues++;
      this.updateProgress();

      nextClue.scrollIntoView({ behavior: "smooth", block: "center" });
    }
  }

  updateProgress() {
    document.getElementById("clues-revealed").textContent = this.revealedClues;
    document.getElementById("progress-bar").style.width =
      (this.revealedClues / this.questions.length) * 100 + "%";
  }

  checkAnswer(selectedCharacterId, button) {
    if (this.gameEnded) return;

    if (!selectedCharacterId) {
      return;
    }

    const resultMessage = document.getElementById("result-message");
    const isCorrect = selectedCharacterId === this.currentAnswer.char_id;

    if (isCorrect) {
      this.gameEnded = true;
      resultMessage.textContent = `✅ Correct! It's ${this.currentAnswer.name_en}!`;
      resultMessage.className =
        "mt-6 p-4 rounded-xl text-center text-xl font-bold bg-green-500/30 text-green-100";
      resultMessage.classList.remove("hidden");

      setTimeout(() => {
        this.showFinalResults(true);
      }, 1500);
    } else {
      button.classList.add("selected-wrong");

      const selectedChar = this.uniqueCharacters.find(
        (c) => c.char_id === selectedCharacterId
      );
      
      // Find the full character data with all clue answers
      const selectedCharData = this.characters.find(
        (c) => c.char_id === selectedCharacterId
      );
      
      // Display the character's answers
      if (selectedCharData) {
        this.displayWrongCharacterAnswers(selectedCharData);
      }
      
      resultMessage.textContent = `❌ Wrong! ${selectedChar?.name_en} is not the answer. Revealing next clue...`;
      resultMessage.className =
        "mt-6 p-4 rounded-xl text-center text-xl font-bold bg-red-500/30 text-red-100";
      resultMessage.classList.remove("hidden");

      setTimeout(() => {
        resultMessage.classList.add("hidden");
        if (this.revealedClues < this.questions.length) {
          this.revealNextClue();
        } else {
          this.gameEnded = true;
          this.showFinalResults(false);
        }
      }, 1500);
    }
  }

  displayWrongCharacterAnswers(character) {
    const container = document.getElementById("wrong-answers-container");
    container.classList.remove("hidden");
    
    const charDiv = document.createElement("div");
    charDiv.className = "bg-red-900/30 rounded-lg p-3 border-2 border-red-500/50";
    charDiv.dataset.charId = character.char_id;
    
    charDiv.innerHTML = `
      <div class="flex items-center gap-3">
        <img
          src="${this.getBasePath()}/images/character_hd/hd_${character.char_id}_${character.card_id}.png"
          alt="${character.name_en}"
          class="w-12 h-12 object-cover rounded-lg shrink-0"
        />
        <p class="text-red-200 font-semibold">${character.name_en}</p>
      </div>
    `;
    
    container.appendChild(charDiv);
  }
  
  getBasePath() {
    const scriptPath = document.currentScript?.src || window.location.pathname;
    if (scriptPath.includes('/gubuk-trainer/')) {
      return '/gubuk-trainer';
    }
    return '';
  }

  showFinalResults(won) {
    const mainLayout = document.querySelector(".grid.grid-cols-1.lg\\:grid-cols-12");
    if (mainLayout) mainLayout.classList.add("hidden");
    document.getElementById("result-message").classList.add("hidden");
    document.getElementById("final-results").classList.remove("hidden");

    if (won) {
      document.getElementById("result-icon").textContent = "🎉";
      document.getElementById("result-title").textContent = "Congratulations!";
      document.getElementById("correct-answer").textContent = this.currentAnswer.name_en;
      document.getElementById("final-clues").textContent = this.revealedClues;
    } else {
      document.getElementById("result-icon").textContent = "😢";
      document.getElementById("result-title").textContent = "Game Over!";
      document.getElementById("correct-answer").textContent = this.currentAnswer.name_en;
      document.getElementById("final-clues").textContent = "all";
    }
  }

  restartQuiz() {
    this.revealedClues = 0;
    this.gameEnded = false;
    const mainLayout = document.querySelector(".grid.grid-cols-1.lg\\:grid-cols-12");
    if (mainLayout) mainLayout.classList.remove("hidden");
    document.getElementById("final-results").classList.add("hidden");
    document.getElementById("result-message").classList.add("hidden");

    document.querySelectorAll(".character-option").forEach((button) => {
      button.classList.remove("selected-wrong");
    });
    
    // Reset dropdown text
    const selectedText = document.getElementById("selected-text");
    if (selectedText) {
      selectedText.textContent = "Choose a character...";
    }
    
    // Clear wrong answers display
    const wrongAnswersContainer = document.getElementById("wrong-answers-container");
    if (wrongAnswersContainer) {
      wrongAnswersContainer.innerHTML = "";
      wrongAnswersContainer.classList.add("hidden");
    }

    this.selectRandomCharacter();
    this.selectRandomQuestions();
    this.initializeClues();
  }

  handleCharacterClick(event) {
    if (this.gameEnded) return;

    const button = event.currentTarget;
    const charId = parseInt(button.dataset.charId);

    this.checkAnswer(charId, button);
  }

  filterCharacters(query) {
    const normalizedQuery = query.toLowerCase().trim();
    const characterOptions = document.querySelectorAll(".character-option");
    
    characterOptions.forEach((option) => {
      const name = option.dataset.name.toLowerCase();
      if (name.includes(normalizedQuery)) {
        option.style.display = "";
      } else {
        option.style.display = "none";
      }
    });
  }

  attachEventListeners() {
    document
      .getElementById("restart-btn")
      .addEventListener("click", () => this.restartQuiz());

    // Dropdown toggle
    const dropdownButton = document.getElementById("dropdown-button");
    const dropdownMenu = document.getElementById("dropdown-menu");
    const searchInput = document.getElementById("character-search");
    
    dropdownButton.addEventListener("click", () => {
      dropdownMenu.classList.toggle("hidden");
      if (!dropdownMenu.classList.contains("hidden")) {
        searchInput.value = "";
        this.filterCharacters("");
        setTimeout(() => searchInput.focus(), 100);
      }
    });

    // Search input
    searchInput.addEventListener("input", (e) => {
      this.filterCharacters(e.target.value);
    });

    // Prevent dropdown close when clicking on search input
    searchInput.addEventListener("click", (e) => {
      e.stopPropagation();
    });

    // Close dropdown when clicking outside
    document.addEventListener("click", (e) => {
      if (!dropdownButton.contains(e.target) && !dropdownMenu.contains(e.target)) {
        dropdownMenu.classList.add("hidden");
      }
    });

    // Character selection from dropdown
    document.querySelectorAll(".character-option").forEach((button) => {
      button.addEventListener("click", (e) => {
        e.stopPropagation();
        this.handleCharacterClick(e);
        
        // Update dropdown text and close menu
        const selectedText = document.getElementById("selected-text");
        selectedText.textContent = button.dataset.name;
        dropdownMenu.classList.add("hidden");
      });
    });
  }
}

