(function () {
  const room = document.getElementById("room");
  const player = document.getElementById("player");

  if (!room || !player) {
    console.error("Game root elements were not found.");
    return;
  }

  const game = window.GameCore.createGame({ room, player });
  game.init();
})();
