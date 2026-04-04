(function () {
  function createGameState(canvas) {
    return {
      room: {
        currentRoomId: "living-room",
        bounds: {
          width: canvas.width,
          height: canvas.height,
        },
        images: {},
      },
      player: {
        position: { x: 0, y: 0 },
        direction: 0,
        frame: 0,
        spriteImage: null,
      },
      animation: {
        lastTime: performance.now(),
        elapsed: 0,
        frameRequestId: 0,
      },
    };
  }

  window.GameState = {
    createGameState,
  };
})();
