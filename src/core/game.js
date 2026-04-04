(function () {
  const ROOM_IDS = ["living-room", "kitchen", "children-room", "basement"];

<<<<<<< HEAD
  const COPY = {
    event01: {
      title: "The Contradiction",
      body: "The TV, radio, and phone are all telling different versions of the same night.",
      timerSeconds: 60,
      choices: [
        { id: "trustTv", label: "Trust the TV." },
        { id: "trustRadio", label: "Trust the radio." },
        { id: "trustPhone", label: "Trust the phone." }
      ]
    },
    event02: {
      title: "The Question",
      body: "The younger child is standing in the doorway, waiting for your answer.",
      timerSeconds: 50,
      choices: [
        { id: "reassure", label: "We're together. Stay close to me." },
        { id: "deflect", label: "It's late. Try to lie down for a bit." },
        { id: "staySilent", label: "Say nothing." }
      ]
    },
    event04: {
      title: "The Knock",
      body: "Someone knocks at the door the moment the candle is lit.",
      timerSeconds: 30,
      choices: [
        { id: "stayQuiet", label: "Stay quiet." },
        { id: "speakThroughDoor", label: "Speak through the door." },
        { id: "moveAway", label: "Pull away and get the child back." }
      ]
    }
  };

  const LEVEL_COPY = {
    level1Start: {
      kicker: "Level One",
      title: "Level One",
      body: "Check the TV, radio, and phone. Press Enter or Space to begin.",
    },
    level1Complete: {
      kicker: "Level One Completed",
      title: "Level One Completed",
      body: "You chose what to trust first. Level Two begins now.",
    },
    level2Complete: {
      kicker: "Level Two Completed",
      title: "Level Two Completed",
      body: "Your answer shaped the night. Level Three begins now.",
    },
    level2Start: {
      kicker: "Level Two",
      title: "Level Two",
      body: "Go to the children's room and answer the younger child. Press Enter or Space to begin.",
    },
    level3Complete: {
      kicker: "Level Three Completed",
      title: "Level Three Completed",
      body: "The candle is lit. Level Four begins now.",
    },
    level3Start: {
      kicker: "Level Three",
      title: "Level Three",
      body: "The blackout begins. Reach the kitchen, take the candle, and light it. Press Enter or Space to begin.",
    },
    level4Complete: {
      kicker: "Level Four Completed",
      title: "Level Four Completed",
      body: "You survived the knock. This is the end of the current playable levels.",
    },
    level4Start: {
      kicker: "Level Four",
      title: "Level Four",
      body: "Someone is at the door. Check the older child and decide what to do. Press Enter or Space to begin.",
    },
=======
  const TASK_IDS = {
    reachChildrenRoom: "reachChildrenRoom",
    returnToChildrenRoom: "returnToChildrenRoom",
    checkYoungerChildAgain: "checkYoungerChildAgain",
    stayWithFamily: "stayWithFamily",
>>>>>>> 126a576be7e48f2f1bda7d1ba105e296b9ed030b
  };

  function createGame(options) {
    const canvas = options.canvas;
    const context = canvas.getContext("2d");
    const sprite = { ...window.PlayerConfig.sprite };
    const input = window.InputController.createInputController(window);
    const roomRegistry = window.RoomRegistry;
    const state = window.GameState.createGameState(canvas);
    const audio = window.AudioManager || null;
    const ui = {
      roomName: document.getElementById("hud-room-name"),
      threatValue: document.getElementById("hud-threat-value"),
      batteryValue: document.getElementById("hud-battery-value"),
      timerValue: document.getElementById("hud-timer-value"),
      taskList: document.getElementById("task-list"),
      interactionHint: document.getElementById("interaction-hint"),
      phoneStatus: document.getElementById("phone-status"),
      dialogueBox: document.getElementById("dialogue-box"),
      dialogueKicker: document.getElementById("dialogue-kicker"),
      dialogueTitle: document.getElementById("dialogue-title"),
      dialogueBody: document.getElementById("dialogue-body"),
      dialogueChoices: document.getElementById("dialogue-choices"),
      levelOverlay: document.getElementById("level-overlay"),
      levelKicker: document.getElementById("level-kicker"),
      levelTitle: document.getElementById("level-title"),
      levelBody: document.getElementById("level-body")
    };
    let currentGate = null;
    let gateCooldown = 0;

    function getCurrentRoom() {
      return roomRegistry.getRoom(state.room.currentRoomId);
    }

<<<<<<< HEAD
=======
    function getContent() {
      return window.GameContent || null;
    }

    function getNestedValue(source, path) {
      return path.reduce((value, key) => {
        if (!value || typeof value !== "object") {
          return undefined;
        }

        return value[key];
      }, source);
    }

    function getText(path, fallback) {
      const content = getContent();
      const value = getNestedValue(content, path);
      return typeof value === "string" ? value : fallback;
    }

    function getChoiceText(eventId, choiceId, fallback) {
      const choices = getNestedValue(getContent(), ["uiText", eventId, "choices"]);
      return choices && typeof choices[choiceId] === "string" ? choices[choiceId] : fallback;
    }

    function getEventCopy(eventId, fallback) {
      return {
        title: getText(["events", eventId, "title"], fallback.title),
        body: getText(["uiText", eventId, "intro"], fallback.body),
        timerSeconds: fallback.timerSeconds,
        choices: fallback.choices.map((choice) => ({
          id: choice.id,
          label: getChoiceText(eventId, choice.id, choice.label),
        })),
      };
    }

    function getTaskLabel(taskId, fallback) {
      return getText(["uiText", "tasks", taskId], fallback);
    }

    function getPromptText(promptId, fallback) {
      return getText(["uiText", "prompts", promptId], fallback);
    }

    function getStatusText(statusId, fallback) {
      return getText(["uiText", "status", statusId], fallback);
    }

    function getHintText(hintId, fallback) {
      return getText(["uiText", "hints", hintId], fallback);
    }

    function getOutcomeText(eventId, outcomeId, fallback) {
      return getText(["uiText", eventId, "outcomes", outcomeId], fallback);
    }

    const COPY = {
      event01: getEventCopy("event01", {
        title: "The Contradiction",
        body: "The TV, radio, and phone are all telling different versions of the same night.",
        timerSeconds: 60,
        choices: [
          { id: "trustTv", label: "Trust the TV." },
          { id: "trustRadio", label: "Trust the radio." },
          { id: "trustPhone", label: "Trust the phone." },
        ],
      }),
      event02: getEventCopy("event02", {
        title: "The Question",
        body: "The younger child is standing in the doorway, waiting for your answer.",
        timerSeconds: 50,
        choices: [
          { id: "reassure", label: "We're together. Stay close to me." },
          { id: "deflect", label: "It's late. Try to lie down for a bit." },
          { id: "staySilent", label: "Say nothing." },
        ],
      }),
      event04: getEventCopy("event04", {
        title: "The Knock",
        body: "Someone knocks at the door the moment the candle is lit.",
        timerSeconds: 30,
        choices: [
          { id: "stayQuiet", label: "Stay quiet." },
          { id: "speakThroughDoor", label: "Speak through the door." },
          { id: "moveAway", label: "Pull away and get the child back." },
        ],
      }),
      event05: getEventCopy("event05", {
        title: "Stay Together",
        body: "The knocking fades. The children still need you more than the door does.",
        timerSeconds: 20,
        choices: [
          { id: "stayTogether", label: "Stay with them until morning." },
        ],
      }),
    };

    function isCollisionDebugEnabled() {
      return Boolean(window.SheshProhorDebug && window.SheshProhorDebug.showCollisionOverlay);
    }

    function updateRoomBounds() {
      state.room.bounds = {
        width: canvas.width,
        height: canvas.height,
      };

      const spriteSize = window.PlayerRenderer.getSpriteSize(sprite);
      state.player.position = window.MovementController.clampPosition(
        state.player.position,
        state.room.bounds,
        spriteSize,
      );
    }

    function resizeCanvas() {
      const rect = canvas.getBoundingClientRect();
      const nextWidth = Math.max(320, Math.round(rect.width || canvas.width));
      const nextHeight = Math.round((nextWidth * 728) / 650);

      canvas.width = nextWidth;
      canvas.height = nextHeight;
      updateRoomBounds();
    }

    function clampThreat(value) {
      return Math.max(1, Math.min(5, Math.round(value * 2) / 2));
    }

    function setThreat(value) {
      state.systems.threat = clampThreat(value);
      for (let index = 1; index <= 5; index += 1) {
        document.body.classList.remove(`threat-${index}`);
      }
      document.body.classList.add(`threat-${Math.ceil(state.systems.threat)}`);
      if (audio) {
        audio.setThreatLevel(state.systems.threat);
      }
    }

    function setBattery(value) {
      state.systems.battery = Math.max(0, Math.min(100, value));
    }

    function setTaskQueue(items) {
      state.ui.taskQueue = items.map((item) => ({ ...item }));
      renderTaskQueue();
    }

    function completeTask(taskId) {
      let changed = false;
      state.ui.taskQueue = state.ui.taskQueue.map((task) => {
        if (task.id !== taskId || task.completed) {
          return task;
        }
        changed = true;
        return { ...task, completed: true };
      });
      if (changed) {
        renderTaskQueue();
      }
      return changed;
    }

    function areTasksComplete() {
      return state.ui.taskQueue.length > 0 && state.ui.taskQueue.every((task) => task.completed);
    }

    function renderTaskQueue() {
      if (!ui.taskList) {
        return;
      }
      ui.taskList.innerHTML = "";
      state.ui.taskQueue.forEach((task) => {
        const item = document.createElement("li");
        item.className = `task-item${task.completed ? " is-complete" : ""}`;
        item.textContent = task.label;
        ui.taskList.appendChild(item);
      });
    }

    function setInteractionHint(text) {
      state.ui.interactionHint = text;
      if (ui.interactionHint) {
        ui.interactionHint.textContent = text;
      }
    }

    function getRoomName(roomId) {
      const room = roomRegistry.getRoom(roomId);
      return room ? room.name : roomId;
    }

    function isValidSpawnPosition(position, room, spriteSize) {
      return window.MovementController.isWalkablePosition(
        position,
        state.room.bounds,
        spriteSize,
        room,
      );
    }

>>>>>>> 126a576be7e48f2f1bda7d1ba105e296b9ed030b
    function getSafeSpawnPosition(spawn, spriteSize, roomId) {
      const targetRoom = roomRegistry.getRoom(roomId);
      const requestedPosition = window.MovementController.clampPosition(
        {
          x: (state.room.bounds.width - spriteSize.width) * spawn.x,
          y: (state.room.bounds.height - spriteSize.height) * spawn.y,
        },
        state.room.bounds,
        spriteSize,
      );

      if (!targetRoom) {
        return requestedPosition;
      }

      return window.MovementController.findNearestWalkablePosition(
        requestedPosition,
        state.room.bounds,
        spriteSize,
        targetRoom,
      );
    }

    function resizeCanvas() {
      const rect = canvas.getBoundingClientRect();
      const nextWidth = Math.max(320, Math.round(rect.width || canvas.width));
      canvas.width = nextWidth;
      canvas.height = Math.round((nextWidth * 728) / 650);
      state.room.bounds = { width: canvas.width, height: canvas.height };
      const spriteSize = window.PlayerRenderer.getSpriteSize(sprite);
      state.player.position = window.MovementController.clampPosition(state.player.position, state.room.bounds, spriteSize);
    }

    function setThreat(value) {
      state.systems.threat = Math.max(1, Math.min(5, Math.round(value * 2) / 2));
      for (let index = 1; index <= 5; index += 1) {
        document.body.classList.remove(`threat-${index}`);
      }
      document.body.classList.add(`threat-${Math.ceil(state.systems.threat)}`);
      if (audio) audio.setThreatLevel(state.systems.threat);
    }

    function setBattery(value) {
      state.systems.battery = Math.max(0, Math.min(100, value));
    }

    function renderTaskQueue() {
      if (!ui.taskList) return;
      ui.taskList.innerHTML = "";
      state.ui.taskQueue.forEach((task) => {
        const item = document.createElement("li");
        item.className = `task-item${task.completed ? " is-complete" : ""}`;
        item.textContent = task.label;
        ui.taskList.appendChild(item);
      });
    }

    function setTaskQueue(items) {
      state.ui.taskQueue = items.map((item) => ({ ...item }));
      renderTaskQueue();
    }

    function completeTask(taskId) {
      let changed = false;
      state.ui.taskQueue = state.ui.taskQueue.map((task) => {
        if (task.id !== taskId || task.completed) return task;
        changed = true;
        return { ...task, completed: true };
      });
      if (changed) renderTaskQueue();
    }

    function areTasksComplete() {
      return state.ui.taskQueue.length > 0 && state.ui.taskQueue.every((task) => task.completed);
    }

    function setInteractionHint(text) {
      state.ui.interactionHint = text;
      if (ui.interactionHint) ui.interactionHint.textContent = text;
    }

    function setPhoneStatus() {
      if (!ui.phoneStatus) return;
      if (state.systems.gameOver) {
        ui.phoneStatus.textContent = "The run has ended.";
        return;
      }

      if (state.systems.battery <= 0 && !state.systems.candleLit) {
        ui.phoneStatus.textContent = getStatusText("phoneDead", "The phone screen is dark now.");
        return;
      }

      if (state.systems.battery <= 5 && !state.systems.candleLit) {
        ui.phoneStatus.textContent = getStatusText("lowBattery", "Phone battery is low.");
        return;
      }

      if (state.events.completed.event05) {
        ui.phoneStatus.textContent = getStatusText("familyHeld", "The family stays together for now.");
        return;
      }

      if (state.systems.candleLit) {
        ui.phoneStatus.textContent = getStatusText("candleLit", "Candle lit. Stay close and keep moving.");
        return;
      }

      ui.phoneStatus.textContent = state.systems.blackout
        ? getStatusText("blackoutActive", "The blackout is active. Hurry before the battery drops more.")
        : getStatusText("phoneMatters", "Phone battery matters during the night.");
    }

<<<<<<< HEAD
=======
    function updateHud() {
      const room = getCurrentRoom();
      if (ui.roomName && room) {
        ui.roomName.textContent = room.name;
      }
      if (ui.threatValue) {
        ui.threatValue.textContent = state.systems.threat.toFixed(1).replace(".0", "");
      }
      if (ui.batteryValue) {
        ui.batteryValue.textContent = `${Math.round(state.systems.battery)}%`;
      }
      if (ui.timerValue) {
        ui.timerValue.textContent = formatTime(state.systems.night.remaining);
      }
      setPhoneStatus();
    }

    function updateAtmosphereLighting() {
      const bodyStyle = document.body.style;

      if (!state.systems.blackout) {
        bodyStyle.setProperty("--light-opacity", "0");
        return;
      }

      const playerCenter = getPlayerCenter();
      const xRatio = Math.max(0, Math.min(1, playerCenter.x / state.room.bounds.width));
      const yRatio = Math.max(0, Math.min(1, playerCenter.y / state.room.bounds.height));
      const batteryFactor = Math.max(0, Math.min(1, state.systems.battery / 18));
      const size = state.systems.candleLit
        ? 0.22
        : Math.max(0.1, 0.14 + batteryFactor * 0.08);
      const glowOpacity = state.systems.candleLit
        ? 0.82
        : Math.max(0.5, 0.64 + batteryFactor * 0.2);

      bodyStyle.setProperty("--light-x", `${(xRatio * 100).toFixed(2)}%`);
      bodyStyle.setProperty("--light-y", `${(yRatio * 100).toFixed(2)}%`);
      bodyStyle.setProperty("--light-size", `${(size * 100).toFixed(2)}%`);
      bodyStyle.setProperty("--light-opacity", `${glowOpacity.toFixed(2)}`);
    }

>>>>>>> 126a576be7e48f2f1bda7d1ba105e296b9ed030b
    function formatTime(totalSeconds) {
      const safeSeconds = Math.max(0, Math.ceil(totalSeconds));
      const minutes = Math.floor(safeSeconds / 60);
      const seconds = safeSeconds % 60;
      return `${String(minutes).padStart(2, "0")}:${String(seconds).padStart(2, "0")}`;
    }

    function updateHud() {
      const room = getCurrentRoom();
      if (ui.roomName && room) ui.roomName.textContent = room.name;
      if (ui.threatValue) ui.threatValue.textContent = state.systems.threat.toFixed(1).replace(".0", "");
      if (ui.batteryValue) ui.batteryValue.textContent = `${Math.round(state.systems.battery)}%`;
      if (ui.timerValue) {
        ui.timerValue.textContent = state.systems.gameOver
          ? "--"
          : formatTime(state.systems.night.remaining);
      }
      setPhoneStatus();
    }

    function renderDialogue() {
      if (!ui.dialogueBox) return;
      const dialogue = state.ui.currentDialogue;
      if (!dialogue) {
        ui.dialogueBox.classList.remove("is-active");
        return;
      }
      ui.dialogueBox.classList.add("is-active");
      ui.dialogueKicker.textContent = state.systems.gameOver
        ? "Run Ended"
        : (state.timers.active ? `Decision - ${Math.ceil(state.timers.active.remaining)}s` : "Decision");
      ui.dialogueTitle.textContent = dialogue.title;
      ui.dialogueBody.textContent = dialogue.body;
      ui.dialogueChoices.innerHTML = "";
      dialogue.choices.forEach((choice, index) => {
        const item = document.createElement("li");
        item.className = `dialogue-choice${index === state.ui.selectedChoiceIndex ? " is-selected" : ""}`;
        item.textContent = `${index + 1}. ${choice.label}`;
        ui.dialogueChoices.appendChild(item);
      });
    }

    function showLevelOverlay(config, onContinue) {
      state.ui.levelOverlay = {
        ...config,
        onContinue: typeof onContinue === "function" ? onContinue : null,
      };

      if (ui.levelKicker) ui.levelKicker.textContent = config.kicker;
      if (ui.levelTitle) ui.levelTitle.textContent = config.title;
      if (ui.levelBody) ui.levelBody.textContent = config.body;
      if (ui.levelOverlay) ui.levelOverlay.classList.add("is-active");
    }

    function hideLevelOverlay() {
      if (ui.levelOverlay) ui.levelOverlay.classList.remove("is-active");
      state.ui.levelOverlay = null;
    }

    function handleLevelOverlayInput() {
      if (!state.ui.levelOverlay) return false;
      if (!input.consumePressed("Enter") && !input.consumePressed("Space")) {
        return true;
      }

      const pending = state.ui.levelOverlay;
      hideLevelOverlay();
      if (pending.onContinue) pending.onContinue();
      return true;
    }

    function clearTimer() {
      state.timers.active = null;
    }

    function closeDialogue() {
      state.ui.currentDialogue = null;
      state.ui.selectedChoiceIndex = 0;
      clearTimer();
      renderDialogue();
    }

    function openDialogue(config) {
      state.ui.currentDialogue = {
        ...config,
        choices: config.choices.map((choice) => ({ ...choice }))
      };
      state.ui.selectedChoiceIndex = 0;
      state.timers.active = config.timerSeconds ? {
        remaining: config.timerSeconds,
        onExpire: () => resolveDialogueChoice(config.choices[config.choices.length - 1].id)
      } : null;
      renderDialogue();
    }

<<<<<<< HEAD
    function showGameOver(title, body) {
      if (state.systems.gameOver) return;
      state.systems.gameOver = true;
      state.systems.gameOverReason = title;
      if (audio) audio.stopAll();
      closeDialogue();
      setTaskQueue([]);
      setInteractionHint("Game over. Refresh the page to play again.");
      state.ui.currentDialogue = { title, body, choices: [] };
      document.body.classList.add("end-dark");
      renderDialogue();
=======
    function clearTimer() {
      state.timers.active = null;
    }

    function updateTimer(dt) {
      if (!state.timers.active) {
        return;
      }
      state.timers.active.remaining -= dt;
      if (state.timers.active.remaining > 0) {
        return;
      }
      const expired = state.timers.active;
      clearTimer();
      if (typeof expired.onExpire === "function") {
        expired.onExpire();
      }
    }

    function updateNightClock(dt) {
      state.systems.night.remaining = Math.max(0, state.systems.night.remaining - dt);
    }

    function updateGateCooldown(dt) {
      gateCooldown = Math.max(0, gateCooldown - dt);
    }

    function getCurrentInteractables() {
      const room = getCurrentRoom();
      return room && room.interactables ? room.interactables : [];
    }

    function getPlayerCenter() {
      const size = window.PlayerRenderer.getSpriteSize(sprite);
      return {
        x: state.player.position.x + size.width * 0.5,
        y: state.player.position.y + size.height * 0.5,
      };
    }

    function getNearbyInteractable() {
      const room = getCurrentRoom();
      if (!room || !room.interactables) {
        return null;
      }
      const playerCenter = getPlayerCenter();
      const minDimension = Math.min(state.room.bounds.width, state.room.bounds.height);

      return room.interactables.find((item) => {
        const targetX = state.room.bounds.width * item.x;
        const targetY = state.room.bounds.height * item.y;
        const maxDistance = minDimension * item.radius;
        return Math.hypot(playerCenter.x - targetX, playerCenter.y - targetY) <= maxDistance;
      }) || null;
    }

    function syncBodyState() {
      document.body.classList.toggle("blackout", state.systems.blackout);
      document.body.classList.toggle("candle-on", state.systems.candleLit);
      document.body.classList.toggle(
        "tv-flicker",
        state.events.activeEventId === "event01" || state.events.activeEventId === "event04",
      );
      document.body.classList.toggle("threat-pulse", state.systems.threat >= 5);
>>>>>>> 126a576be7e48f2f1bda7d1ba105e296b9ed030b
    }

    function triggerEvent01() {
      state.events.activeEventId = "event01";
      if (audio) audio.onEvent("event01");
      setTaskQueue([
<<<<<<< HEAD
        { id: "checkTv", label: "Walk to the TV.", completed: false },
        { id: "checkRadio", label: "Go to the kitchen radio.", completed: false },
        { id: "checkPhone", label: "Check the phone.", completed: false }
=======
        { id: "checkTv", label: getTaskLabel("checkTv", "Walk to the TV."), completed: false },
        { id: "checkRadio", label: getTaskLabel("checkRadio", "Go to the kitchen radio."), completed: false },
        { id: "checkPhone", label: getTaskLabel("checkPhone", "Check the phone."), completed: false },
>>>>>>> 126a576be7e48f2f1bda7d1ba105e296b9ed030b
      ]);
    }

    function triggerEvent02() {
<<<<<<< HEAD
      if (state.events.completed.event02) return;
      state.events.activeEventId = "event02";
      setTaskQueue([
        { id: "goToChild", label: "Go to the younger child.", completed: false },
        { id: "answerChild", label: "Answer the question.", completed: false }
=======
      if (state.events.completed.event02) {
        return;
      }

      completeTask(TASK_IDS.reachChildrenRoom);
      state.events.activeEventId = "event02";
      setTaskQueue([
        { id: "goToChild", label: getTaskLabel("goToChild", "Go to the younger child."), completed: false },
        { id: "answerChild", label: getTaskLabel("answerChild", "Answer the question."), completed: false },
>>>>>>> 126a576be7e48f2f1bda7d1ba105e296b9ed030b
      ]);
      setInteractionHint(
        getHintText(
          "reachChildAndInteract",
          `Go to the younger child and ${getPromptText("interact", "Press SPACE to interact.").toLowerCase()}`,
        ),
      );
    }

    function prepareLevelTwo() {
      state.events.activeEventId = "event02";
      setTaskQueue([
        { id: "goToChild", label: "Go to the younger child.", completed: false },
        { id: "answerChild", label: "Answer the question.", completed: false }
      ]);
      setInteractionHint("Head to the children's room and answer the younger child.");
    }

    function triggerEvent03() {
      if (state.events.blackoutStarted) return;
      state.events.blackoutStarted = true;
      state.events.activeEventId = "event03";
      state.systems.blackout = true;
      if (audio) audio.onEvent("event03");
      setTaskQueue([
<<<<<<< HEAD
        { id: "reachKitchen", label: "Run to the kitchen.", completed: false },
        { id: "openDrawer", label: "Open the third drawer.", completed: false },
        { id: "findCandle", label: "Take the candle.", completed: false },
        { id: "lightCandle", label: "Light it.", completed: false }
=======
        { id: "reachKitchen", label: getTaskLabel("reachKitchen", "Run to the kitchen."), completed: false },
        { id: "openDrawer", label: getTaskLabel("openDrawer", "Open the third drawer."), completed: false },
        { id: "findCandle", label: getTaskLabel("findCandle", "Take the candle."), completed: false },
        { id: "lightCandle", label: getTaskLabel("lightCandle", "Light the candle."), completed: false },
>>>>>>> 126a576be7e48f2f1bda7d1ba105e296b9ed030b
      ]);
      setInteractionHint(getHintText("blackoutStart", "The room is dark now. Go to the kitchen and find the candle."));
    }

    function prepareLevelThree() {
      state.events.activeEventId = "event03";
      setTaskQueue([
        { id: "reachKitchen", label: "Run to the kitchen.", completed: false },
        { id: "openDrawer", label: "Open the third drawer.", completed: false },
        { id: "findCandle", label: "Take the candle.", completed: false },
        { id: "lightCandle", label: "Light it.", completed: false }
      ]);
      setInteractionHint("Blackout. Go to the kitchen and light the candle.");
    }

    function triggerEvent04() {
      if (state.events.completed.event04) return;
      state.events.activeEventId = "event04";
      if (audio) audio.onEvent("event04");
      setTaskQueue([
<<<<<<< HEAD
        { id: "goToDoor", label: "Go to the front door.", completed: false },
        { id: "checkChild", label: "Find the older child.", completed: false },
        { id: "hideOrRespond", label: "Stay quiet or answer.", completed: false }
=======
        { id: "goToDoor", label: getTaskLabel("goToDoor", "Go to the front door."), completed: false },
        { id: "checkChild", label: getTaskLabel("checkChild", "Find the older child."), completed: false },
        { id: "hideOrRespond", label: getTaskLabel("hideOrRespond", "Stay quiet or answer."), completed: false },
>>>>>>> 126a576be7e48f2f1bda7d1ba105e296b9ed030b
      ]);
      setInteractionHint(getHintText("frontDoorChoice", "Someone is at the door. Go there or check on the older child."));
    }

    function triggerEvent05() {
      if (state.events.completed.event05 || state.events.activeEventId === "event05") {
        return;
      }

      state.events.activeEventId = "event05";
      if (audio) {
        audio.onEvent("event05");
      }
      setTaskQueue([
        {
          id: TASK_IDS.returnToChildrenRoom,
          label: getTaskLabel("returnToChildrenRoom", "Go back to the children's room."),
          completed: state.room.currentRoomId === "children-room",
        },
        {
          id: TASK_IDS.checkYoungerChildAgain,
          label: getTaskLabel("checkYoungerChildAgain", "Check on the younger child."),
          completed: false,
        },
        {
          id: TASK_IDS.stayWithFamily,
          label: getTaskLabel("stayWithFamily", "Stay with the children until morning."),
          completed: false,
        },
      ]);
      setInteractionHint(getHintText("returnToChildren", "Take the candle back to the children."));
    }

    function applyEndingState() {
      document.body.classList.remove("end-safe", "end-almost", "end-dark");

      if (state.systems.threat <= 2.5) {
        document.body.classList.add("end-safe");
      } else if (state.systems.threat <= 4) {
        document.body.classList.add("end-almost");
      } else {
        document.body.classList.add("end-dark");
      }
    }

    function prepareLevelFour() {
      state.events.activeEventId = "event04";
      setTaskQueue([
        { id: "goToDoor", label: "Go to the front door.", completed: false },
        { id: "checkChild", label: "Find the older child.", completed: false },
        { id: "hideOrRespond", label: "Stay quiet or answer.", completed: false }
      ]);
      setInteractionHint("Someone is at the door. Check the older child and decide what to do.");
    }

    function resolveDialogueChoice(choiceId) {
      const dialogue = state.ui.currentDialogue;
      if (!dialogue || state.systems.gameOver) return;
      const activeEventId = state.events.activeEventId;
      closeDialogue();

      if (activeEventId === "event01") {
        state.events.completed.event01 = true;
        state.events.choiceHistory.event01 = choiceId;
        let event01Outcome = getOutcomeText("event01", "tvChosen", "You decide to trust the TV.");

        if (choiceId === "trustRadio") {
          setThreat(state.systems.threat + 0.5);
          event01Outcome = getOutcomeText("event01", "radioChosen", "You decide to trust the radio.");
        } else if (choiceId === "trustPhone") {
          setThreat(state.systems.threat + 1);
          setBattery(state.systems.battery - 2);
          event01Outcome = getOutcomeText("event01", "phoneChosen", "You decide to trust the phone.");
        } else {
          setThreat(2);
        }
<<<<<<< HEAD
        if (state.systems.threat < 2) setThreat(2);
        showLevelOverlay(LEVEL_COPY.level1Complete, () => {
          showLevelOverlay(LEVEL_COPY.level2Start, () => {
            state.events.questionUnlocked = true;
            prepareLevelTwo();
          });
        });
=======
        if (state.systems.threat < 2) {
          setThreat(2);
        }
        state.events.questionUnlocked = true;
        state.events.activeEventId = "event02-pending";
        setTaskQueue([
          {
            id: TASK_IDS.reachChildrenRoom,
            label: getTaskLabel("goToChildrensRoom", "Go to the children's room."),
            completed: false,
          },
        ]);
        setInteractionHint(`${event01Outcome} ${getHintText("headToChildrenRoom", "Head to the children's room.")}`);
        maybeTriggerRoomEvents();
>>>>>>> 126a576be7e48f2f1bda7d1ba105e296b9ed030b
        return;
      }

      if (activeEventId === "event02") {
        state.events.completed.event02 = true;
        state.events.choiceHistory.event02 = choiceId;
        completeTask("answerChild");
<<<<<<< HEAD
        if (choiceId === "reassure") setThreat(state.systems.threat + 0.5);
        else if (choiceId === "deflect") setThreat(state.systems.threat + 1);
        else setThreat(state.systems.threat + 1.5);
        showLevelOverlay(LEVEL_COPY.level2Complete, () => {
          showLevelOverlay(LEVEL_COPY.level3Start, () => {
            prepareLevelThree();
            triggerEvent03();
          });
        });
=======
        let event02Outcome = getOutcomeText("event02", "childComforted", "The child steps closer. The counting stops.");

        if (choiceId === "reassure") {
          setThreat(state.systems.threat + 0.5);
        } else if (choiceId === "deflect") {
          setThreat(state.systems.threat + 1);
          event02Outcome = getOutcomeText("event02", "childUnsettled", "The child nods, but does not move.");
        } else {
          setThreat(state.systems.threat + 1.5);
          event02Outcome = getOutcomeText("event02", "childWithdraws", "The child looks at you for a moment, then looks away.");
        }
        triggerEvent03();
        setInteractionHint(`${event02Outcome} ${getHintText("blackoutStart", "The room is dark now. Go to the kitchen and find the candle.")}`);
>>>>>>> 126a576be7e48f2f1bda7d1ba105e296b9ed030b
        return;
      }

      if (activeEventId === "event04") {
        state.events.completed.event04 = true;
        state.events.choiceHistory.event04 = choiceId;
        completeTask("hideOrRespond");
<<<<<<< HEAD
        if (choiceId === "speakThroughDoor") setThreat(state.systems.threat + 1);
        else if (choiceId === "moveAway") setThreat(Math.max(1, state.systems.threat - 0.5));
        showLevelOverlay(LEVEL_COPY.level4Complete, () => {
          setInteractionHint("This is the end of the current playable levels.");
        });
=======
        let event04Outcome = getOutcomeText("event04", "doorStaysClosed", "You stay still. The silence stretches.");

        if (choiceId === "speakThroughDoor") {
          setThreat(state.systems.threat + 1);
          event04Outcome = getOutcomeText("event04", "presenceRevealed", "Your voice gives the apartment away.");
        } else if (choiceId === "moveAway") {
          setThreat(Math.max(1, state.systems.threat - 0.5));
          event04Outcome = getOutcomeText("event04", "childRedirected", "You turn from the door and go to the older child first.");
        }
        triggerEvent05();
        setInteractionHint(`${event04Outcome} ${getHintText("returnToChildren", "Take the candle back to the children.")}`);
        return;
      }

      if (activeEventId === "event05") {
        state.events.completed.event05 = true;
        state.events.choiceHistory.event05 = choiceId;
        completeTask(TASK_IDS.stayWithFamily);
        setInteractionHint(getOutcomeText("event05", "familyHeldTogether", "The candle burns low, but everyone is still here."));
        applyEndingState();
>>>>>>> 126a576be7e48f2f1bda7d1ba105e296b9ed030b
      }
    }

    function maybeOpenEvent01Dialogue() {
<<<<<<< HEAD
      if (!state.events.completed.event01 && areTasksComplete()) openDialogue(COPY.event01);
=======
      if (state.events.completed.event01 || !areTasksComplete()) {
        return;
      }
      setInteractionHint(getHintText("chooseSource", "Choose which source to trust."));
      openDialogue(COPY.event01);
>>>>>>> 126a576be7e48f2f1bda7d1ba105e296b9ed030b
    }

    function maybeTriggerRoomEvents() {
      if (state.events.questionUnlocked && !state.events.completed.event02 && state.room.currentRoomId === "children-room") {
        triggerEvent02();
      }
      if (state.events.activeEventId === "event03" && state.room.currentRoomId === "kitchen") {
        completeTask("reachKitchen");
      }

      if (state.events.activeEventId === "event05" && state.room.currentRoomId === "children-room") {
        completeTask(TASK_IDS.returnToChildrenRoom);
        if (!state.events.completed.event05 && !state.ui.currentDialogue) {
          setInteractionHint(getHintText("stayCloseToChild", "Stay close to the younger child and press SPACE."));
        }
      }
    }

    function getPlayerCenter() {
      const size = window.PlayerRenderer.getSpriteSize(sprite);
      return { x: state.player.position.x + size.width * 0.5, y: state.player.position.y + size.height * 0.5 };
    }

    function getNearbyInteractable() {
      const room = getCurrentRoom();
      if (!room || !room.interactables) return null;
      const playerCenter = getPlayerCenter();
      const minDimension = Math.min(state.room.bounds.width, state.room.bounds.height);
      return room.interactables.find((item) => {
        const targetX = state.room.bounds.width * item.x;
        const targetY = state.room.bounds.height * item.y;
        return Math.hypot(playerCenter.x - targetX, playerCenter.y - targetY) <= minDimension * item.radius;
      }) || null;
    }

    function handleInteractable(interactable) {
      if (!interactable || state.systems.gameOver) return;
      if (audio) audio.onInteractable(interactable.id);

      switch (interactable.id) {
        case "tv":
          if (state.events.activeEventId === "event01") {
            state.events.interacted.tv = true;
            completeTask("checkTv");
            maybeOpenEvent01Dialogue();
          }
          setInteractionHint(getText(["dialogue", "tv", "intro"], "The TV keeps flickering through the signal."));
          break;
        case "radio":
          if (state.events.activeEventId === "event01") {
            state.events.interacted.radio = true;
            completeTask("checkRadio");
            maybeOpenEvent01Dialogue();
          }
          setInteractionHint(getText(["dialogue", "radio", "static"], "The radio sounds clearer than the TV, but not safer."));
          break;
        case "phone":
          if (state.events.activeEventId === "event01") {
            state.events.interacted.phone = true;
            completeTask("checkPhone");
            maybeOpenEvent01Dialogue();
          }
          setInteractionHint(getText(["dialogue", "phone", "lowBatteryWarning"], "The phone is still working, but the battery is low."));
          break;
        case "youngerChild":
          if (state.events.activeEventId === "event02") {
            completeTask("goToChild");
            openDialogue(COPY.event02);
          } else if (state.events.activeEventId === "event05" && !state.events.completed.event05) {
            completeTask(TASK_IDS.checkYoungerChildAgain);
            openDialogue(COPY.event05);
          }
          break;
        case "kitchenDrawer3":
          if (state.events.activeEventId === "event03") {
            if (!state.inventory.candle) {
              completeTask("openDrawer");
              state.inventory.candle = true;
              completeTask("findCandle");
              setInteractionHint(getHintText("relightCandle", "Press SPACE again on the drawer to light the candle."));
            } else if (!state.systems.candleLit) {
              state.systems.candleLit = true;
              completeTask("lightCandle");
              state.events.completed.event03 = true;
<<<<<<< HEAD
              showLevelOverlay(LEVEL_COPY.level3Complete, () => {
                showLevelOverlay(LEVEL_COPY.level4Start, () => {
                  prepareLevelFour();
                  triggerEvent04();
                });
              });
=======
              setInteractionHint(getHintText("event03Complete", "The flame catches. The apartment comes back in pieces."));
              triggerEvent04();
              setInteractionHint(
                `${getHintText("event03Complete", "The flame catches. The apartment comes back in pieces.")} ${getHintText("frontDoorChoice", "Someone is at the door. Go there or check on the older child.")}`,
              );
>>>>>>> 126a576be7e48f2f1bda7d1ba105e296b9ed030b
            }
          }
          break;
        case "frontDoor":
          if (state.events.activeEventId === "event04") {
            completeTask("goToDoor");
            openDialogue(COPY.event04);
          }
          break;
        case "olderChild":
          if (state.events.activeEventId === "event04") {
            completeTask("checkChild");
            setInteractionHint(getHintText("frontDoorChild", getText(["dialogue", "olderChild", "duringKnock"], "The older child hesitates near the front of the room.")));
          }
          break;
        case "toyRobot":
          state.inventory.robotOff = true;
          setInteractionHint(getHintText("toyRobotOff", "The toy robot is silent now."));
          break;
        default:
          setInteractionHint(`${interactable.label}.`);
          break;
      }
    }

    function handleChoiceInput() {
      const dialogue = state.ui.currentDialogue;
      if (!dialogue || !dialogue.choices.length || state.systems.gameOver) return;
      if (input.consumePressed("ArrowUp")) {
        state.ui.selectedChoiceIndex = (state.ui.selectedChoiceIndex + dialogue.choices.length - 1) % dialogue.choices.length;
        renderDialogue();
      }
      if (input.consumePressed("ArrowDown")) {
        state.ui.selectedChoiceIndex = (state.ui.selectedChoiceIndex + 1) % dialogue.choices.length;
        renderDialogue();
      }
      for (let index = 0; index < dialogue.choices.length; index += 1) {
        if (input.consumePressed(`Digit${index + 1}`)) {
          resolveDialogueChoice(dialogue.choices[index].id);
          return;
        }
      }
      if (input.consumePressed("Enter")) {
        resolveDialogueChoice(dialogue.choices[state.ui.selectedChoiceIndex].id);
      }
    }

    function updateBattery(dt) {
      if (!state.systems.gameOver && state.systems.blackout && !state.systems.candleLit) {
        setBattery(state.systems.battery - dt * 0.8);
      }
    }

    function maybeTriggerGameOver() {
      if (state.systems.gameOver) return;
      if (state.systems.night.remaining <= 0) {
        showGameOver("Time Ran Out", "Morning did not come in time. The night closed in before you could finish what you needed to do.");
        return;
      }
      if (state.systems.blackout && !state.systems.candleLit && state.systems.battery <= 0) {
        showGameOver("Battery Dead", "The phone battery died before you could light the candle. The apartment fell fully dark.");
      }
    }

    function updatePosition(dt) {
      if (state.ui.currentDialogue || state.ui.levelOverlay || state.systems.gameOver) {
        state.player.frame = 0;
        if (audio) audio.setMovementActive(false, dt);
        return;
      }
      const vector = window.MovementController.getMovementVector(input.keys);
      const dx = vector.dx;
      const dy = vector.dy;
      const spriteSize = window.PlayerRenderer.getSpriteSize(sprite);
      if (dx === 0 && dy === 0) {
        state.player.frame = 0;
        if (audio) audio.setMovementActive(false, dt);
        return;
      }
      const nextDirection = window.MovementController.getDirection(state.player.direction, dx, dy);
      state.player.direction = nextDirection;
      const speed = window.MovementController.getMoveSpeed(input, window.PlayerConfig.speed);
      state.player.position = window.MovementController.resolveRoomCollision(
        state.player.position,
        { x: state.player.position.x + dx * speed * dt, y: state.player.position.y + dy * speed * dt },
        state.room.bounds,
        spriteSize,
        getCurrentRoom()
      );
      if (audio) audio.setMovementActive(true, dt);
      state.animation.elapsed += dt;
      const fps = window.MovementController.getAnimationFps(input, window.PlayerConfig.fps);
      if (state.animation.elapsed >= 1 / fps) {
        const maxCols = window.PlayerConfig.animationColumns[state.player.direction] || sprite.cols;
        state.player.frame = (state.player.frame + 1) % maxCols;
        state.animation.elapsed = 0;
      }
    }

    function isGateTriggered(gate, spriteSize) {
      const footProbe = window.MovementController.getFootProbe(state.player.position, spriteSize, state.room.bounds);
      const xRatio = footProbe.x;
      const yRatio = footProbe.y;
      const threshold = gate.threshold || 24;
      if (gate.area) return xRatio >= gate.area.x.start && xRatio <= gate.area.x.end && yRatio >= gate.area.y.start && yRatio <= gate.area.y.end;
      if (gate.side === "left") return state.player.position.x <= threshold && yRatio >= gate.range.start && yRatio <= gate.range.end;
      if (gate.side === "right") return state.player.position.x + spriteSize.width >= state.room.bounds.width - threshold && yRatio >= gate.range.start && yRatio <= gate.range.end;
      if (gate.side === "top") return state.player.position.y <= threshold && xRatio >= gate.range.start && xRatio <= gate.range.end;
      if (gate.side === "bottom") return state.player.position.y + spriteSize.height >= state.room.bounds.height - threshold && xRatio >= gate.range.start && xRatio <= gate.range.end;
      return false;
    }

    function findActiveGate(spriteSize) {
      if (gateCooldown > 0 || state.systems.gameOver) return null;
      const room = getCurrentRoom();
      if (!room || !room.gates) return null;
      return room.gates.find((gate) => isGateTriggered(gate, spriteSize)) || null;
    }

    function trySwitchRoom(spriteSize) {
      if (!currentGate || state.systems.gameOver || !input.consumePressed("KeyE")) return;
      state.room.currentRoomId = currentGate.targetRoomId;
      state.room.visited[currentGate.targetRoomId] = true;
      state.player.position = getSafeSpawnPosition(currentGate.spawn, spriteSize, currentGate.targetRoomId);
      state.player.frame = 0;
      if (audio) audio.setRoom(currentGate.targetRoomId);
      maybeTriggerRoomEvents();
      currentGate = null;
      gateCooldown = 0.2;
    }

    function updateInteractionState() {
      if (state.ui.levelOverlay || state.systems.gameOver) return;
      const interactable = getNearbyInteractable();
      const gateHint = currentGate ? `Press E to ${currentGate.label || `enter ${currentGate.targetRoomId}`}` : "";
      if (interactable && gateHint) setInteractionHint(`${gateHint}. Press SPACE: ${interactable.label}`);
      else if (interactable) setInteractionHint(`Press SPACE: ${interactable.label}`);
      else if (gateHint) setInteractionHint(gateHint);
      if (input.consumePressed("Space") && interactable) handleInteractable(interactable);
    }

    function updateTimer(dt) {
      if (!state.timers.active || state.ui.levelOverlay || state.systems.gameOver) return;
      state.timers.active.remaining -= dt;
      if (state.timers.active.remaining > 0) return;
      const expired = state.timers.active;
      clearTimer();
      if (typeof expired.onExpire === "function") expired.onExpire();
    }

    function updateNightClock(dt) {
      if (!state.ui.levelOverlay && !state.systems.gameOver) {
        state.systems.night.remaining = Math.max(0, state.systems.night.remaining - dt);
      }
    }

    function syncBodyState() {
      document.body.classList.toggle("blackout", state.systems.blackout);
      document.body.classList.toggle("candle-on", state.systems.candleLit);
      document.body.classList.toggle("tv-flicker", state.events.activeEventId === "event01" || state.events.activeEventId === "event04");
    }

    function render() {
      const room = getCurrentRoom();
      const backgroundImage = room ? state.room.images[room.id] : null;
      const nearbyInteractable = getNearbyInteractable();
      window.PlayerRenderer.drawRoom(context, canvas, { backgroundImage });
      window.PlayerRenderer.drawInteractables(context, canvas, room && room.interactables ? room.interactables : [], nearbyInteractable);
      window.PlayerRenderer.drawPlayer(
        context,
        state.player.spriteImage,
        sprite,
        window.PlayerConfig.animationColumns,
        state.player.direction,
        state.player.frame,
<<<<<<< HEAD
        state.player.position
      );
=======
        state.player.position,
        {
          showCandle: state.systems.candleLit,
        },
      );
      drawCollisionDebugOverlay(currentRoom, window.PlayerRenderer.getSpriteSize(sprite));
    }

    function updateInteractionState() {
      const interactable = getNearbyInteractable();
      const gateHint = currentGate ? getGateHint(currentGate) : "";

      // E is reserved for gate travel, while SPACE keeps object interactions.
      if (interactable && gateHint) {
        setInteractionHint(`${gateHint}. Press SPACE: ${interactable.label}`);
      } else if (interactable) {
        setInteractionHint(`Press SPACE: ${interactable.label}`);
      } else if (gateHint) {
        setInteractionHint(gateHint);
      }

      if (input.consumePressed("Space") && interactable) {
        handleInteractable(interactable);
      }
    }

    function loop(now) {
      const dt = Math.min(0.05, (now - state.animation.lastTime) / 1000);
      state.animation.lastTime = now;

      handleChoiceInput();
      updatePosition(dt);
      const spriteSize = window.PlayerRenderer.getSpriteSize(sprite);
      updateGateCooldown(dt);
      currentGate = findActiveGate(spriteSize);
      maybeTriggerRoomEvents();
      updateTimer(dt);
      updateNightClock(dt);
      updateBattery(dt);
      updateAtmosphereLighting();
      updateInteractionState();
      trySwitchRoom(spriteSize);
      syncBodyState();
      updateHud();
      renderDialogue();
      render();
      if (audio) {
        audio.update(dt);
      }
      input.clearPressed();

      state.animation.frameRequestId = requestAnimationFrame(loop);
>>>>>>> 126a576be7e48f2f1bda7d1ba105e296b9ed030b
    }

    function loadRoomImages() {
      ROOM_IDS.forEach((roomId) => {
        const roomConfig = roomRegistry.getRoom(roomId);
        if (!roomConfig) return;
        const image = new Image();
        image.src = roomConfig.background;
        state.room.images[roomId] = image;
      });
    }

    function loop(now) {
      const dt = Math.min(0.05, (now - state.animation.lastTime) / 1000);
      state.animation.lastTime = now;
      if (handleLevelOverlayInput()) {
        updateHud();
        renderDialogue();
        render();
        input.clearPressed();
        state.animation.frameRequestId = requestAnimationFrame(loop);
        return;
      }
      handleChoiceInput();
      updatePosition(dt);
      const spriteSize = window.PlayerRenderer.getSpriteSize(sprite);
      gateCooldown = Math.max(0, gateCooldown - dt);
      currentGate = findActiveGate(spriteSize);
      updateTimer(dt);
      updateNightClock(dt);
      updateBattery(dt);
      maybeTriggerGameOver();
      updateInteractionState();
      trySwitchRoom(spriteSize);
      syncBodyState();
      updateHud();
      renderDialogue();
      render();
      if (audio) audio.update(dt);
      input.clearPressed();
      state.animation.frameRequestId = requestAnimationFrame(loop);
    }

    function init() {
      const image = new Image();

      loadRoomImages();
      resizeCanvas();
      const spriteSize = window.PlayerRenderer.getSpriteSize(sprite);
      state.player.position = getSafeSpawnPosition({ x: 0.5, y: 0.65 }, spriteSize, state.room.currentRoomId);
      currentGate = findActiveGate(spriteSize);
      if (audio) {
        audio.init();
        audio.setRoom(state.room.currentRoomId);
      }
      triggerEvent01();
      setThreat(1);
      updateHud();
      renderTaskQueue();
      render();
      showLevelOverlay(LEVEL_COPY.level1Start);
      state.animation.frameRequestId = requestAnimationFrame(loop);

      image.onload = () => {
        sprite.sheetW = image.width;
        sprite.sheetH = image.height;
        state.player.spriteImage = image;
      };
      image.onerror = () => {
        console.error("Failed to load sprite sheet:", sprite.url);
      };
      image.src = sprite.url;
      window.addEventListener("resize", resizeCanvas);
    }

    return {
      init,
      destroy() {
        cancelAnimationFrame(state.animation.frameRequestId);
        window.removeEventListener("resize", resizeCanvas);
        input.dispose();
      }
    };
  }

  window.GameCore = {
    createGame
  };
})();
