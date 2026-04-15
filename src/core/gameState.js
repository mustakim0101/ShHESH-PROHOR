(function () {
  function createGameState(canvas, options = {}) {
    const nightDuration = options.nightDurationSeconds || 3 * 60;
    const difficultyId = options.difficultyId || "normal";
    const difficultyLabel = options.difficultyLabel || "Normal";

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
        difficulty: {
          id: difficultyId,
          label: difficultyLabel,
        },
        threat: 1,
        battery: 40,
        score: 0,
        candleLit: false,
        candleFuel: 1,
        blackout: false,
        gameOver: false,
        familySafe: false,
        gameOverReason: "",
        night: {
          duration: nightDuration,
          remaining: nightDuration,
        },
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
        levelOverlay: null,
      },
      events: {
        activeEventId: "event01",
        completed: {},
        choiceHistory: {},
        interactionCounts: {},
        interacted: {
          tv: false,
          radio: false,
          phone: false,
        },
        carryingChildren: false,
        questionUnlocked: false,
        blackoutStarted: false,
      },
      timers: {
        active: null,
        morningTimeoutId: 0,
        menuRedirectTimeoutId: 0,
      },
    };
  }

  window.GameState = {
    createGameState,
  };
})();
