(function () {
  const STORAGE_KEY = "sheshProhorDifficulty";

  const DIFFICULTIES = {
    easy: {
      id: "easy",
      label: "Easy",
      nightDurationSeconds: Math.round(3 * 60 * 1.18),
      batteryDrainMultiplier: 0.8,
      threatGainMultiplier: 0.82,
      choiceTimerMultiplier: 1.2,
      interactionRadiusMultiplier: 1.14,
      scoreMultiplier: 0.85,
    },
    normal: {
      id: "normal",
      label: "Normal",
      nightDurationSeconds: 3 * 60,
      batteryDrainMultiplier: 1,
      threatGainMultiplier: 1,
      choiceTimerMultiplier: 1,
      interactionRadiusMultiplier: 1,
      scoreMultiplier: 1,
    },
    hard: {
      id: "hard",
      label: "Hard",
      nightDurationSeconds: Math.round(3 * 60 * 0.88),
      batteryDrainMultiplier: 1.24,
      threatGainMultiplier: 1.22,
      choiceTimerMultiplier: 0.82,
      interactionRadiusMultiplier: 0.9,
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
