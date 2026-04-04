(function () {
  const audio = window.AudioManager || null;
  const mainPanel = document.getElementById("main-menu-panel");
  const aboutPanel = document.getElementById("about-panel");
  const aboutButton = document.getElementById("about-button");
  const aboutBackButton = document.getElementById("about-back-button");
  const startGameButton = document.getElementById("start-game-button");

  function showPanel(panelToShow) {
    [mainPanel, aboutPanel].forEach((panel) => {
      if (!panel) {
        return;
      }

      const shouldShow = panel === panelToShow;
      panel.hidden = !shouldShow;
      panel.classList.toggle("is-hidden", !shouldShow);
    });
  }

  if (!audio) {
    aboutButton?.addEventListener("click", () => showPanel(aboutPanel));
    aboutBackButton?.addEventListener("click", () => showPanel(mainPanel));
    return;
  }

  audio.init();
  audio.setMenuActive(true);

  aboutButton?.addEventListener("click", () => {
    showPanel(aboutPanel);
  });

  aboutBackButton?.addEventListener("click", () => {
    showPanel(mainPanel);
  });

  startGameButton?.addEventListener("click", () => {
    // A direct click lets us safely arm menu/story music before navigation.
    audio.unlock();
    audio.setStoryActive(true);
  });

  window.addEventListener("pagehide", () => {
    if (audio.currentScene !== "story") {
      audio.stopMusic();
    }
  });
})();
