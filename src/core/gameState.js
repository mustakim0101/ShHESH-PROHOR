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
        visited: {
          "living-room": true,
        },
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
      systems: {
        threat: 1,
        battery: 18,
        candleLit: false,
        blackout: false,
      },
      inventory: {
        candle: false,
        charger: false,
        basementKey: false,
        robotOff: false,
      },
      ui: {
        taskQueue: [],
        interactionHint: "Move close to an object and press SPACE.",
        phoneHint: "Phone battery matters during the night.",
        currentDialogue: null,
        selectedChoiceIndex: 0,
      },
      events: {
        activeEventId: "event01",
        completed: {},
        choiceHistory: {},
        interacted: {
          tv: false,
          radio: false,
          phone: false,
        },
        questionUnlocked: false,
        blackoutStarted: false,
      },
      timers: {
        active: null,
      },
    };
  }

  window.GameState = {
    createGameState,
  };
})();
