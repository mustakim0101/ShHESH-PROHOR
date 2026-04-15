(function () {
  const STORAGE_KEY = "sheshProhorDifficulty";

  const DIFFICULTIES = {
    easy: {
      id: "easy",
      label: "Easy",
      timerMultiplier: 1.18,
      scoreMultiplier: 0.85,
    },
    normal: {
      id: "normal",
      label: "Normal",
      timerMultiplier: 1,
      scoreMultiplier: 1,
    },
    hard: {
      id: "hard",
      label: "Hard",
      timerMultiplier: 0.88,
      scoreMultiplier: 1.25,
    },
  };

  function readStoredDifficultyId() {
    try {
      return window.sessionStorage.getItem(STORAGE_KEY) || "normal";
    } catch (error) {
      return "normal";
    }
  }

  function getDifficulty(id) {
    return DIFFICULTIES[id] || DIFFICULTIES.normal;
  }

  function getSelectedDifficulty() {
    return getDifficulty(readStoredDifficultyId());
  }

  function setSelectedDifficulty(id) {
    const difficulty = getDifficulty(id);

    try {
      window.sessionStorage.setItem(STORAGE_KEY, difficulty.id);
    } catch (error) {
      // Ignore storage failures and keep the in-memory default behavior.
    }

    return difficulty;
  }

  window.DifficultyConfig = {
    STORAGE_KEY,
    DIFFICULTIES,
    getDifficulty,
    getSelectedDifficulty,
    setSelectedDifficulty,
  };
})();
