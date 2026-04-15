(function () {
  const audio = window.AudioManager || null;
  const mainPanel = document.getElementById("main-menu-panel");
  const aboutPanel = document.getElementById("about-panel");
  const aboutButton = document.getElementById("about-button");
  const aboutBackButtonTop = document.getElementById("about-back-button-top");
  const startGameButton = document.getElementById("start-game-button");
  const difficultyOptions = Array.from(document.querySelectorAll("[data-difficulty]"));
  const difficultyHighlight = document.getElementById("difficulty-highlight");
  const difficultyHighlightTitle = difficultyHighlight ? difficultyHighlight.querySelector(".difficulty-highlight-title") : null;
  const difficultyHighlightCopy = difficultyHighlight ? difficultyHighlight.querySelector(".difficulty-highlight-copy") : null;
  let selectedDifficultyId = "normal";
  const difficultyDescriptions = {
    easy: {
      title: "Easy Mode",
      copy: "Longer timers and a lower score multiplier for a more forgiving run.",
    },
    normal: {
      title: "Normal Mode",
      copy: "Standard timers with the baseline score multiplier.",
    },
    hard: {
      title: "Hard Mode",
      copy: "Shorter timers and a higher score multiplier if you can stay clean under pressure.",
    },
  };

  function setDifficultySelection(nextDifficultyId) {
    selectedDifficultyId = nextDifficultyId;

    if (window.DifficultyConfig) {
      const selectedDifficulty = window.DifficultyConfig.setSelectedDifficulty(nextDifficultyId);
      selectedDifficultyId = selectedDifficulty.id;
    }

    difficultyOptions.forEach((button) => {
      const isSelected = button.dataset.difficulty === selectedDifficultyId;
      button.classList.toggle("is-selected", isSelected);
      button.setAttribute("aria-pressed", isSelected ? "true" : "false");
    });

    const description = difficultyDescriptions[selectedDifficultyId] || difficultyDescriptions.normal;
    if (difficultyHighlightTitle) {
      difficultyHighlightTitle.textContent = description.title;
    }
    if (difficultyHighlightCopy) {
      difficultyHighlightCopy.textContent = description.copy;
    }
  }

  function wirePanelButtons() {
    aboutButton?.addEventListener("click", () => {
      showPanel(aboutPanel);
    });

    aboutBackButtonTop?.addEventListener("click", () => {
      showPanel(mainPanel);
    });

    difficultyOptions.forEach((button) => {
      button.addEventListener("click", () => {
        setDifficultySelection(button.dataset.difficulty || "normal");
      });
    });
  }

  function showPanel(panelToShow) {
    [mainPanel, aboutPanel].forEach((panel) => {
      if (!panel) {
        return;
      }

      const shouldShow = panel === panelToShow;
      panel.hidden = !shouldShow;
      panel.classList.toggle("is-hidden", !shouldShow);
    });
    window.scrollTo(0, 0);
  }

  wirePanelButtons();
  setDifficultySelection(
    window.DifficultyConfig
      ? window.DifficultyConfig.getSelectedDifficulty().id
      : selectedDifficultyId,
  );

  if (!audio) {
    return;
  }

  try {
    audio.init();
    audio.setMenuActive(true);

    startGameButton?.addEventListener("click", () => {
      // A direct click lets us safely arm menu/story music before navigation.
      setDifficultySelection(selectedDifficultyId);
      audio.unlock();
      audio.setStoryActive(true);
    });

    window.addEventListener("pagehide", () => {
      if (audio.currentScene !== "story") {
        audio.stopMusic();
      }
    });
  } catch (error) {
    console.warn("Menu audio init failed:", error);
  }
})();
