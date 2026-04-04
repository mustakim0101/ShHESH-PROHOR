(function () {
  const canvas = document.getElementById("game-canvas");
  const storyScreen = document.getElementById("story-screen");

  if (!canvas) {
    console.error("Game canvas was not found.");
    return;
  }

  const game = window.GameCore.createGame({ canvas });
  let gameStarted = false;

  function beginGameplay() {
    if (gameStarted) {
      return;
    }

    gameStarted = true;
    game.init();
  }

  if (!storyScreen || !window.StoryIntro) {
    beginGameplay();
    return;
  }

  const storyIntro = window.StoryIntro.createStoryIntro({
    root: storyScreen,
    onBackToMenu() {
      window.location.href = "index.html";
    },
    onStartGame: beginGameplay,
  });

  storyIntro.init();
})();
