(function () {
  const COPY = {
    event01: {
      title: "The Contradiction",
      body: "The TV, radio, and phone are all telling different versions of the same night.",
      timerSeconds: 60,
      choices: [
        { id: "trustTv", label: "Trust the TV." },
        { id: "trustRadio", label: "Trust the radio." },
        { id: "trustPhone", label: "Trust the phone." },
      ],
    },
    event02: {
      title: "The Question",
      body: "The younger child is standing in the doorway, waiting for your answer.",
      timerSeconds: 50,
      choices: [
        { id: "reassure", label: "We're together. Stay close to me." },
        { id: "deflect", label: "It's late. Try to lie down for a bit." },
        { id: "staySilent", label: "Say nothing." },
      ],
    },
    event04: {
      title: "The Knock",
      body: "Someone knocks at the door the moment the candle is lit.",
      timerSeconds: 30,
      choices: [
        { id: "stayQuiet", label: "Stay quiet." },
        { id: "speakThroughDoor", label: "Speak through the door." },
        { id: "moveAway", label: "Pull away and get the child back." },
      ],
    },
  };

  function createGame(options) {
    const canvas = options.canvas;
    const context = canvas.getContext("2d");
    const sprite = { ...window.PlayerConfig.sprite };
    const input = window.InputController.createInputController(window);
    const roomRegistry = window.RoomRegistry;
    const state = window.GameState.createGameState(canvas);
    const ui = getUiElements();

    function getUiElements() {
      return {
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
      };
    }

    function getCurrentRoom() {
      return roomRegistry.getRoom(state.room.currentRoomId);
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

    function setPhoneStatus() {
      if (!ui.phoneStatus) {
        return;
      }
      ui.phoneStatus.textContent = state.systems.blackout
        ? "The blackout is active. Hurry before the battery drops more."
        : "Phone battery matters during the night.";
    }

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
        ui.timerValue.textContent = state.timers.active
          ? `${Math.ceil(state.timers.active.remaining)}s`
          : "--";
      }
      setPhoneStatus();
    }

    function openDialogue(config) {
      state.ui.currentDialogue = {
        ...config,
        choices: config.choices.map((choice) => ({ ...choice })),
      };
      state.ui.selectedChoiceIndex = 0;
      startTimer(config.timerSeconds || 0, () => resolveDialogueChoice(config.choices[config.choices.length - 1].id));
      renderDialogue();
    }

    function closeDialogue() {
      state.ui.currentDialogue = null;
      state.ui.selectedChoiceIndex = 0;
      clearTimer();
      renderDialogue();
    }

    function renderDialogue() {
      if (!ui.dialogueBox) {
        return;
      }
      const dialogue = state.ui.currentDialogue;
      if (!dialogue) {
        ui.dialogueBox.classList.remove("is-active");
        return;
      }

      ui.dialogueBox.classList.add("is-active");
      ui.dialogueKicker.textContent = "Decision";
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

    function startTimer(seconds, onExpire) {
      if (!seconds) {
        state.timers.active = null;
        return;
      }
      state.timers.active = {
        remaining: seconds,
        onExpire,
      };
    }

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
      document.body.classList.toggle("tv-flicker", state.events.activeEventId === "event01" || state.events.activeEventId === "event04");
    }

    function triggerEvent01() {
      state.events.activeEventId = "event01";
      setTaskQueue([
        { id: "checkTv", label: "Walk to the TV.", completed: false },
        { id: "checkRadio", label: "Go to the kitchen radio.", completed: false },
        { id: "checkPhone", label: "Check the phone.", completed: false },
      ]);
    }

    function triggerEvent02() {
      if (state.events.completed.event02) {
        return;
      }
      state.events.activeEventId = "event02";
      setTaskQueue([
        { id: "goToChild", label: "Go to the younger child.", completed: false },
        { id: "answerChild", label: "Answer the question.", completed: false },
      ]);
      setInteractionHint("Go to the younger child and press SPACE.");
    }

    function triggerEvent03() {
      if (state.events.blackoutStarted) {
        return;
      }
      state.events.blackoutStarted = true;
      state.events.activeEventId = "event03";
      state.systems.blackout = true;
      setTaskQueue([
        { id: "reachKitchen", label: "Run to the kitchen.", completed: false },
        { id: "openDrawer", label: "Open the third drawer.", completed: false },
        { id: "findCandle", label: "Take the candle.", completed: false },
        { id: "lightCandle", label: "Light it.", completed: false },
      ]);
      setInteractionHint("The room is dark now. Go to the kitchen and find the candle.");
    }

    function triggerEvent04() {
      if (state.events.completed.event04) {
        return;
      }
      state.events.activeEventId = "event04";
      setTaskQueue([
        { id: "goToDoor", label: "Go to the front door.", completed: false },
        { id: "checkChild", label: "Find the older child.", completed: false },
        { id: "hideOrRespond", label: "Stay quiet or answer.", completed: false },
      ]);
      setInteractionHint("Someone is at the door. Go there or check on the older child.");
    }

    function resolveDialogueChoice(choiceId) {
      const dialogue = state.ui.currentDialogue;
      if (!dialogue) {
        return;
      }

      const activeEventId = state.events.activeEventId;
      closeDialogue();

      if (activeEventId === "event01") {
        state.events.completed.event01 = true;
        state.events.choiceHistory.event01 = choiceId;
        if (choiceId === "trustRadio") {
          setThreat(state.systems.threat + 0.5);
        } else if (choiceId === "trustPhone") {
          setThreat(state.systems.threat + 1);
          setBattery(state.systems.battery - 2);
        } else {
          setThreat(2);
        }
        if (state.systems.threat < 2) {
          setThreat(2);
        }
        state.events.questionUnlocked = true;
        setInteractionHint("Head to the children's room.");
        setTaskQueue([]);
        return;
      }

      if (activeEventId === "event02") {
        state.events.completed.event02 = true;
        state.events.choiceHistory.event02 = choiceId;
        completeTask("answerChild");
        if (choiceId === "reassure") {
          setThreat(state.systems.threat + 0.5);
        } else if (choiceId === "deflect") {
          setThreat(state.systems.threat + 1);
        } else {
          setThreat(state.systems.threat + 1.5);
        }
        triggerEvent03();
        return;
      }

      if (activeEventId === "event04") {
        state.events.completed.event04 = true;
        state.events.choiceHistory.event04 = choiceId;
        completeTask("hideOrRespond");
        if (choiceId === "speakThroughDoor") {
          setThreat(state.systems.threat + 1);
        } else if (choiceId === "moveAway") {
          setThreat(Math.max(1, state.systems.threat - 0.5));
        }
        setInteractionHint("Keep moving between rooms and follow the task list.");
      }
    }

    function maybeOpenEvent01Dialogue() {
      if (state.events.completed.event01 || !areTasksComplete()) {
        return;
      }
      openDialogue(COPY.event01);
    }

    function maybeTriggerRoomEvents() {
      if (state.events.questionUnlocked
        && !state.events.completed.event02
        && state.room.currentRoomId === "children-room") {
        triggerEvent02();
      }

      if (state.events.activeEventId === "event03" && state.room.currentRoomId === "kitchen") {
        completeTask("reachKitchen");
      }
    }

    function handleInteractable(interactable) {
      if (!interactable) {
        return;
      }

      switch (interactable.id) {
        case "tv":
          if (state.events.activeEventId === "event01") {
            state.events.interacted.tv = true;
            completeTask("checkTv");
            maybeOpenEvent01Dialogue();
          }
          setInteractionHint("The TV keeps flickering through the signal.");
          break;
        case "radio":
          if (state.events.activeEventId === "event01") {
            state.events.interacted.radio = true;
            completeTask("checkRadio");
            maybeOpenEvent01Dialogue();
          }
          setInteractionHint("The radio sounds clearer than the TV, but not safer.");
          break;
        case "phone":
          if (state.events.activeEventId === "event01") {
            state.events.interacted.phone = true;
            completeTask("checkPhone");
            maybeOpenEvent01Dialogue();
          }
          setInteractionHint("The phone is still working, but the battery is low.");
          break;
        case "youngerChild":
          if (state.events.activeEventId === "event02") {
            completeTask("goToChild");
            openDialogue(COPY.event02);
          }
          break;
        case "kitchenDrawer3":
          if (state.events.activeEventId === "event03") {
            if (!state.inventory.candle) {
              completeTask("openDrawer");
              state.inventory.candle = true;
              completeTask("findCandle");
              setInteractionHint("Press SPACE again on the drawer to light the candle.");
            } else if (!state.systems.candleLit) {
              state.systems.candleLit = true;
              completeTask("lightCandle");
              state.events.completed.event03 = true;
              triggerEvent04();
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
            setInteractionHint("The older child hesitates near the front of the room.");
          }
          break;
        case "toyRobot":
          state.inventory.robotOff = true;
          setInteractionHint("The toy robot is silent now.");
          break;
        default:
          setInteractionHint(`${interactable.label}.`);
          break;
      }
    }

    function handleChoiceInput() {
      const dialogue = state.ui.currentDialogue;
      if (!dialogue) {
        return;
      }

      if (input.consumePressed("ArrowUp")) {
        state.ui.selectedChoiceIndex = (state.ui.selectedChoiceIndex + dialogue.choices.length - 1) % dialogue.choices.length;
        renderDialogue();
      }

      if (input.consumePressed("ArrowDown")) {
        state.ui.selectedChoiceIndex = (state.ui.selectedChoiceIndex + 1) % dialogue.choices.length;
        renderDialogue();
      }

      for (let index = 0; index < dialogue.choices.length; index += 1) {
        const keyCode = `Digit${index + 1}`;
        if (input.consumePressed(keyCode)) {
          resolveDialogueChoice(dialogue.choices[index].id);
          return;
        }
      }

      if (input.consumePressed("Enter")) {
        resolveDialogueChoice(dialogue.choices[state.ui.selectedChoiceIndex].id);
      }
    }

    function updateBattery(dt) {
      if (state.systems.blackout && !state.systems.candleLit) {
        setBattery(state.systems.battery - dt * 0.8);
      }
    }

    function updatePosition(dt) {
      if (state.ui.currentDialogue) {
        state.player.frame = 0;
        return;
      }

      const vector = window.MovementController.getMovementVector(input.keys);
      const dx = vector.dx;
      const dy = vector.dy;
      const spriteSize = window.PlayerRenderer.getSpriteSize(sprite);

      if (dx === 0 && dy === 0) {
        state.player.frame = 0;
        return;
      }

      const nextDirection = window.MovementController.getDirection(
        state.player.direction,
        dx,
        dy,
      );

      if (nextDirection !== state.player.direction) {
        state.player.direction = nextDirection;
        state.player.frame = 0;
      } else {
        state.player.direction = nextDirection;
      }

      const speed = window.MovementController.getMoveSpeed(input, window.PlayerConfig.speed);

      state.player.position = window.MovementController.clampPosition(
        {
          x: state.player.position.x + dx * speed * dt,
          y: state.player.position.y + dy * speed * dt,
        },
        state.room.bounds,
        spriteSize,
      );

      state.animation.elapsed += dt;
      const fps = window.MovementController.getAnimationFps(input, window.PlayerConfig.fps);
      if (state.animation.elapsed >= 1 / fps) {
        const maxCols = window.PlayerConfig.animationColumns[state.player.direction] || sprite.cols;
        state.player.frame = (state.player.frame + 1) % maxCols;
        state.animation.elapsed = 0;
      }

      trySwitchRoom(spriteSize);
    }

    function trySwitchRoom(spriteSize) {
      const currentRoom = getCurrentRoom();
      if (!currentRoom || !currentRoom.gates) {
        return;
      }

      for (const gate of currentRoom.gates) {
        if (!isGateTriggered(gate, spriteSize)) {
          continue;
        }

        state.room.currentRoomId = gate.targetRoomId;
        state.room.visited[gate.targetRoomId] = true;
        state.player.position = getSpawnPosition(gate.spawn, spriteSize);
        state.player.frame = 0;
        maybeTriggerRoomEvents();
        return;
      }
    }

    function isGateTriggered(gate, spriteSize) {
      const playerCenterX = state.player.position.x + spriteSize.width * 0.5;
      const playerCenterY = state.player.position.y + spriteSize.height * 0.5;
      const xRatio = playerCenterX / state.room.bounds.width;
      const yRatio = playerCenterY / state.room.bounds.height;
      const threshold = gate.threshold || 24;

      if (gate.area) {
        return xRatio >= gate.area.x.start
          && xRatio <= gate.area.x.end
          && yRatio >= gate.area.y.start
          && yRatio <= gate.area.y.end;
      }

      if (gate.side === "left") {
        return state.player.position.x <= threshold
          && yRatio >= gate.range.start
          && yRatio <= gate.range.end;
      }

      if (gate.side === "right") {
        return state.player.position.x + spriteSize.width >= state.room.bounds.width - threshold
          && yRatio >= gate.range.start
          && yRatio <= gate.range.end;
      }

      if (gate.side === "top") {
        return state.player.position.y <= threshold
          && xRatio >= gate.range.start
          && xRatio <= gate.range.end;
      }

      if (gate.side === "bottom") {
        return state.player.position.y + spriteSize.height >= state.room.bounds.height - threshold
          && xRatio >= gate.range.start
          && xRatio <= gate.range.end;
      }

      return false;
    }

    function getSpawnPosition(spawn, spriteSize) {
      return window.MovementController.clampPosition(
        {
          x: (state.room.bounds.width - spriteSize.width) * spawn.x,
          y: (state.room.bounds.height - spriteSize.height) * spawn.y,
        },
        state.room.bounds,
        spriteSize,
      );
    }

    function render() {
      const currentRoom = getCurrentRoom();
      const backgroundImage = currentRoom ? state.room.images[currentRoom.id] : null;
      const nearbyInteractable = getNearbyInteractable();

      window.PlayerRenderer.drawRoom(context, canvas, {
        backgroundImage,
      });
      window.PlayerRenderer.drawInteractables(
        context,
        canvas,
        getCurrentInteractables(),
        nearbyInteractable,
      );
      window.PlayerRenderer.drawPlayer(
        context,
        state.player.spriteImage,
        sprite,
        window.PlayerConfig.animationColumns,
        state.player.direction,
        state.player.frame,
        state.player.position,
      );
    }

    function updateInteractionState() {
      const interactable = getNearbyInteractable();
      if (interactable) {
        setInteractionHint(`Press SPACE: ${interactable.label}`);
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
      updateTimer(dt);
      updateBattery(dt);
      updateInteractionState();
      syncBodyState();
      updateHud();
      renderDialogue();
      render();
      input.clearPressed();

      state.animation.frameRequestId = requestAnimationFrame(loop);
    }

    function loadRoomImages() {
      const rooms = ["living-room", "kitchen", "children-room", "basement"];

      rooms.forEach((roomId) => {
        const roomConfig = roomRegistry.getRoom(roomId);
        if (!roomConfig) {
          return;
        }

        const image = new Image();
        image.src = roomConfig.background;
        state.room.images[roomId] = image;
      });
    }

    function init() {
      const image = new Image();

      image.onload = () => {
        sprite.sheetW = image.width;
        sprite.sheetH = image.height;
        state.player.spriteImage = image;

        loadRoomImages();
        resizeCanvas();

        const spriteSize = window.PlayerRenderer.getSpriteSize(sprite);
        state.player.position = getSpawnPosition({ x: 0.5, y: 0.65 }, spriteSize);

        triggerEvent01();
        setThreat(1);
        updateHud();
        renderTaskQueue();
        render();
        state.animation.frameRequestId = requestAnimationFrame(loop);
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
      },
    };
  }

  window.GameCore = {
    createGame,
  };
})();
