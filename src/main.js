(function () {
  const canvas = document.getElementById("game-canvas");

  if (!canvas) {
    console.error("Game canvas was not found.");
    return;
  }

  const game = window.GameCore.createGame({ canvas });
  game.init();
})();
