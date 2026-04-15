(function () {
  const ROOM_IDS = ["living-room", "kitchen", "children-room", "basement"];
  const BATTERY_DRAIN_PER_SECOND = 40 / (2.5 * 60);

  const TASK_IDS = {
    reachChildrenRoom: "reachChildrenRoom",
    returnToChildrenRoom: "returnToChildrenRoom",
    checkYoungerChildAgain: "checkYoungerChildAgain",
    stayWithFamily: "stayWithFamily",
    goToBasement: "goToBasement",
    waitForDawn: "waitForDawn",
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
    level2Start: {
      kicker: "Level Two",
      title: "Level Two",
      body: "Go to the children's room and answer the younger child. Press Enter or Space to begin.",
    },
    level2Complete: {
      kicker: "Level Two Completed",
      title: "Level Two Completed",
      body: "Your answer shaped the night. Level Three begins now.",
    },
    level3Start: {
      kicker: "Level Three",
      title: "Level Three",
      body: "The blackout begins. Reach the kitchen, take the candle, and light it. Press Enter or Space to begin.",
    },
    level3Complete: {
      kicker: "Level Three Completed",
      title: "Level Three Completed",
      body: "The candle is lit. Level Four begins now.",
    },
    level4Start: {
      kicker: "Level Four",
      title: "Level Four",
      body: "Someone is at the door. Check the older child and decide what to do. Press Enter or Space to begin.",
    },
    level4Complete: {
      kicker: "Level Four Completed",
      title: "Level Four Completed",
      body: "You survived the knock. One final step remains: keep the family together.",
    },
    level5Start: {
      kicker: "Final Beat",
      title: "Stay Together",
      body: "Take the candle back to the children and hold the family together. Press Enter or Space to begin.",
    },
    level5Complete: {
      kicker: "Level Five Completed",
      title: "Family Together",
      body: "You gathered everyone. The basement is the safest place left. Press Enter or Space to continue.",
    },
    level6Notice: {
      kicker: "Last Level",
      title: "ONE LAST RUN",
      body: "This is the last level. Get everyone downstairs before the night closes in.",
    },
    level6Start: {
      kicker: "Level Six",
      title: "Basement Shelter",
      body: "Get the family to the basement and wait in the safe corner. Time is running out and the battery is close to dying. Press Enter or Space to begin.",
    },
    level6Complete: {
      kicker: "Morning",
      title: "MORNING CAME",
      body: "Morning reaches the basement at last. You kept the family safe from the strangers outside.",
    },
  };

  function createGame(options) {
    const canvas = options.canvas;
    const context = canvas.getContext("2d");
    const sprite = { ...window.PlayerConfig.sprite };
    const input = window.InputController.createInputController(window);
    const roomRegistry = window.RoomRegistry;
    const difficultyConfig = window.DifficultyConfig || null;
    const scoreConfig = window.ScoreConfig || { tasks: {}, choices: {}, milestones: {}, bonuses: {} };
    const difficulty = difficultyConfig
      ? difficultyConfig.getSelectedDifficulty()
      : {
        id: "normal",
        label: "Normal",
        timerMultiplier: 1,
        scoreMultiplier: 1,
      };
    const state = window.GameState.createGameState(canvas, {
      difficultyId: difficulty.id,
      difficultyLabel: difficulty.label,
      nightDurationSeconds: Math.round(3 * 60 * (difficulty.timerMultiplier || 1)),
    });
    const audio = window.AudioManager || null;
    const ui = getUiElements();
    let currentGate = null;
    let gateCooldown = 0;
    let endingScoreApplied = false;

    // Flip this in the browser console with:
    // window.SheshProhorDebug.showCollisionOverlay = true
    window.SheshProhorDebug = window.SheshProhorDebug || {
      showCollisionOverlay: false,
    };

    function getUiElements() {
      return {
        roomName: document.getElementById("hud-room-name"),
        threatValue: document.getElementById("hud-threat-value"),
        batteryValue: document.getElementById("hud-battery-value"),
        timerValue: document.getElementById("hud-timer-value"),
        scoreValue: document.getElementById("hud-score-value"),
        taskList: document.getElementById("task-list"),
        difficultyStatus: document.getElementById("difficulty-status"),
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
        levelBody: document.getElementById("level-body"),
      };
    }

    function getCurrentRoom() {
      return roomRegistry.getRoom(state.room.currentRoomId);
    }

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

    function getPositionFromFootProbe(footProbe, bounds, spriteSize) {
      return {
        x: footProbe.x * bounds.width - spriteSize.width * 0.5,
        y: footProbe.y * bounds.height - spriteSize.height * 0.88,
      };
    }

    function updateRoomBounds(preservePlayerPosition = false) {
      const previousBounds = state.room.bounds;
      const spriteSize = window.PlayerRenderer.getSpriteSize(sprite);
      const previousFootProbe = preservePlayerPosition && previousBounds.width > 0 && previousBounds.height > 0
        ? window.MovementController.getFootProbe(state.player.position, spriteSize, previousBounds)
        : null;

      state.room.bounds = {
        width: canvas.width,
        height: canvas.height,
      };

      const nextPosition = previousFootProbe
        ? getPositionFromFootProbe(previousFootProbe, state.room.bounds, spriteSize)
        : state.player.position;

      state.player.position = window.MovementController.clampPosition(
        nextPosition,
        state.room.bounds,
        spriteSize,
      );
    }

    function resizeCanvas() {
      const rect = canvas.getBoundingClientRect();
      const nextWidth = Math.max(320, Math.round(rect.width || canvas.width));
      const nextHeight = Math.round((nextWidth * 728) / 650);

      if (canvas.width === nextWidth && canvas.height === nextHeight) {
        return;
      }

      canvas.width = nextWidth;
      canvas.height = nextHeight;
      updateRoomBounds(true);
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

    function addThreatDelta(amount) {
      setThreat(state.systems.threat + amount);
    }

    function addBatteryDelta(amount) {
      setBattery(state.systems.battery + amount);
    }

    function addScore(basePoints) {
      if (!basePoints || basePoints <= 0) {
        return 0;
      }

      const adjustedPoints = Math.round(basePoints * difficulty.scoreMultiplier);
      state.systems.score = Math.max(0, state.systems.score + adjustedPoints);
      return adjustedPoints;
    }

    function awardTaskScore(taskId) {
      addScore(scoreConfig.tasks && scoreConfig.tasks[taskId]);
    }

    function awardChoiceScore(eventId, choiceId) {
      const eventScores = scoreConfig.choices && scoreConfig.choices[eventId];
      if (!eventScores) {
        return;
      }

      addScore(eventScores[choiceId]);
    }

    function applyEndingScore(type) {
      if (endingScoreApplied) {
        return;
      }

      endingScoreApplied = true;

      if (type === "good") {
        addScore(scoreConfig.milestones.goodEnding || 0);
        addScore(Math.round(state.systems.battery) * (scoreConfig.bonuses.remainingBatteryPerPoint || 0));
        addScore(Math.round(state.systems.night.remaining) * (scoreConfig.bonuses.remainingSecondsPerPoint || 0));
        return;
      }

      addScore(scoreConfig.milestones[type] || scoreConfig.milestones.badEnding || 0);
    }

    function getRunSummaryText() {
      return `Final score: ${state.systems.score}. Difficulty: ${state.systems.difficulty.label}.`;
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
        awardTaskScore(taskId);
        renderTaskQueue();
      }
      return changed;
    }

    function areTasksComplete() {
      return state.ui.taskQueue.length > 0 && state.ui.taskQueue.every((task) => task.completed);
    }

    function isTaskComplete(taskId) {
      return state.ui.taskQueue.some((task) => task.id === taskId && task.completed);
    }

    function isEvent04DecisionReady() {
      return isTaskComplete("goToDoor") && isTaskComplete("checkChild");
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

    function getInteractionCount(interactableId) {
      return state.events.interactionCounts[interactableId] || 0;
    }

    function markInteraction(interactableId) {
      const nextCount = getInteractionCount(interactableId) + 1;
      state.events.interactionCounts[interactableId] = nextCount;
      return nextCount;
    }

    function getRepeatedLine(interactableId, lines, fallback) {
      const count = Math.max(0, getInteractionCount(interactableId) - 1);
      if (Array.isArray(lines) && lines.length > 0) {
        return lines[Math.min(count, lines.length - 1)];
      }
      return fallback;
    }

    function triggerAlarmPulse() {
      document.body.classList.remove("impact-pulse");
      void document.body.offsetWidth;
      document.body.classList.add("impact-pulse");
      window.setTimeout(() => {
        document.body.classList.remove("impact-pulse");
      }, 700);
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

      // If a stair spawn lands on a blocked strip, nudge it to the closest valid floor tile.
      return window.MovementController.findNearestWalkablePosition(
        requestedPosition,
        state.room.bounds,
        spriteSize,
        targetRoom,
      );
    }

    function getGateDebugRect(gate, spriteSize) {
      if (gate.area) {
        return {
          x: gate.area.x.start * state.room.bounds.width,
          y: gate.area.y.start * state.room.bounds.height,
          width: (gate.area.x.end - gate.area.x.start) * state.room.bounds.width,
          height: (gate.area.y.end - gate.area.y.start) * state.room.bounds.height,
        };
      }

      const threshold = gate.threshold || 24;

      if (gate.side === "left") {
        return {
          x: 0,
          y: gate.range.start * state.room.bounds.height,
          width: threshold,
          height: (gate.range.end - gate.range.start) * state.room.bounds.height,
        };
      }

      if (gate.side === "right") {
        return {
          x: state.room.bounds.width - threshold,
          y: gate.range.start * state.room.bounds.height,
          width: threshold,
          height: (gate.range.end - gate.range.start) * state.room.bounds.height,
        };
      }

      if (gate.side === "top") {
        return {
          x: gate.range.start * state.room.bounds.width,
          y: 0,
          width: (gate.range.end - gate.range.start) * state.room.bounds.width,
          height: threshold,
        };
      }

      if (gate.side === "bottom") {
        return {
          x: gate.range.start * state.room.bounds.width,
          y: state.room.bounds.height - threshold,
          width: (gate.range.end - gate.range.start) * state.room.bounds.width,
          height: threshold,
        };
      }

      return null;
    }

    function drawDebugZone(zone, fillStyle, strokeStyle) {
      const x = zone.x.start * state.room.bounds.width;
      const y = zone.y.start * state.room.bounds.height;
      const width = (zone.x.end - zone.x.start) * state.room.bounds.width;
      const height = (zone.y.end - zone.y.start) * state.room.bounds.height;

      context.save();
      context.fillStyle = fillStyle;
      context.strokeStyle = strokeStyle;
      context.lineWidth = 2;
      context.fillRect(x, y, width, height);
      context.strokeRect(x, y, width, height);
      context.restore();
    }

    function drawDebugMarker(position, label, color) {
      const footProbe = window.MovementController.getFootProbe(
        position,
        window.PlayerRenderer.getSpriteSize(sprite),
        state.room.bounds,
      );
      const x = footProbe.x * state.room.bounds.width;
      const y = footProbe.y * state.room.bounds.height;

      context.save();
      context.strokeStyle = color;
      context.fillStyle = color;
      context.lineWidth = 2;
      context.beginPath();
      context.moveTo(x - 8, y);
      context.lineTo(x + 8, y);
      context.moveTo(x, y - 8);
      context.lineTo(x, y + 8);
      context.stroke();
      context.font = '12px "JetBrains Mono", monospace';
      context.fillText(label, x + 10, y - 10);
      context.restore();
    }

    function drawCollisionDebugOverlay(currentRoom, spriteSize) {
      if (!isCollisionDebugEnabled() || !currentRoom) {
        return;
      }

      (currentRoom.walkableZones || []).forEach((zone) => {
        drawDebugZone(zone, "rgba(72, 201, 176, 0.18)", "rgba(72, 201, 176, 0.9)");
      });

      (currentRoom.blockedZones || []).forEach((zone) => {
        drawDebugZone(zone, "rgba(231, 76, 60, 0.18)", "rgba(231, 76, 60, 0.9)");
      });

      (currentRoom.gates || []).forEach((gate) => {
        const rect = getGateDebugRect(gate, spriteSize);
        if (!rect) {
          return;
        }

        context.save();
        context.strokeStyle = "rgba(255, 214, 102, 0.95)";
        context.lineWidth = 2;
        context.setLineDash([8, 6]);
        context.strokeRect(rect.x, rect.y, rect.width, rect.height);
        context.restore();
      });

      ROOM_IDS.forEach((roomId) => {
        const sourceRoom = roomRegistry.getRoom(roomId);
        if (!sourceRoom || !Array.isArray(sourceRoom.gates)) {
          return;
        }

        sourceRoom.gates.forEach((gate) => {
          if (gate.targetRoomId !== currentRoom.id) {
            return;
          }

          const spawnPosition = getSafeSpawnPosition(gate.spawn, spriteSize, currentRoom.id);
          const requestedPosition = window.MovementController.clampPosition(
            {
              x: (state.room.bounds.width - spriteSize.width) * gate.spawn.x,
              y: (state.room.bounds.height - spriteSize.height) * gate.spawn.y,
            },
            state.room.bounds,
            spriteSize,
          );
          const moved = requestedPosition.x !== spawnPosition.x || requestedPosition.y !== spawnPosition.y;
          drawDebugMarker(
            spawnPosition,
            moved ? `${sourceRoom.name} spawn*` : `${sourceRoom.name} spawn`,
            moved ? "rgba(255, 159, 67, 0.98)" : "rgba(93, 173, 226, 0.98)",
          );
        });
      });

      const footProbe = window.MovementController.getFootProbe(
        state.player.position,
        spriteSize,
        state.room.bounds,
      );
      const playerFootX = footProbe.x * state.room.bounds.width;
      const playerFootY = footProbe.y * state.room.bounds.height;

      context.save();
      context.fillStyle = isValidSpawnPosition(state.player.position, currentRoom, spriteSize)
        ? "rgba(46, 204, 113, 0.95)"
        : "rgba(255, 99, 71, 0.95)";
      context.beginPath();
      context.arc(playerFootX, playerFootY, 6, 0, Math.PI * 2);
      context.fill();
      context.restore();
    }

    function getGateHint(gate) {
      if (!gate) {
        return "";
      }

      // Gates can define friendly labels, but we also keep a fallback.
      const actionLabel = gate.label || `enter ${getRoomName(gate.targetRoomId)}`;
      return `Press E to ${actionLabel}`;
    }

    function setPhoneStatus() {
      if (!ui.phoneStatus) {
        return;
      }

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

      if (state.events.completed.event06) {
        ui.phoneStatus.textContent = "The family is safe together in the basement.";
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

    function updateHud() {
      const room = getCurrentRoom();
      if (ui.roomName && room) {
        ui.roomName.textContent = room.name;
      }
      if (ui.threatValue) {
        ui.threatValue.textContent = state.systems.threat.toFixed(1).replace(".0", "");
      }
      if (ui.batteryValue) {
        ui.batteryValue.textContent = state.systems.familySafe
          ? "--"
          : `${Math.round(state.systems.battery)}%`;
      }
      if (ui.timerValue) {
        ui.timerValue.textContent = state.systems.gameOver || state.systems.familySafe
          ? "--"
          : formatTime(state.systems.night.remaining);
      }
      if (ui.scoreValue) {
        ui.scoreValue.textContent = String(state.systems.score);
      }
      if (ui.difficultyStatus) {
        ui.difficultyStatus.textContent = `Mode: ${state.systems.difficulty.label}`;
      }
      setPhoneStatus();
    }

    function updateAtmosphereLighting() {
      const bodyStyle = document.body.style;

      if (!state.systems.blackout || !state.systems.candleLit) {
        bodyStyle.setProperty("--light-opacity", "0");
        return;
      }

      const playerCenter = getPlayerCenter();
      const rect = canvas.getBoundingClientRect();
      const viewportWidth = Math.max(window.innerWidth, 1);
      const viewportHeight = Math.max(window.innerHeight, 1);
      const screenX = rect.left + (playerCenter.x / state.room.bounds.width) * rect.width;
      const screenY = rect.top + (playerCenter.y / state.room.bounds.height) * rect.height;
      const xRatio = Math.max(0, Math.min(1, screenX / viewportWidth));
      const yRatio = Math.max(0, Math.min(1, screenY / viewportHeight));

      bodyStyle.setProperty("--light-x", `${(xRatio * 100).toFixed(2)}%`);
      bodyStyle.setProperty("--light-y", `${(yRatio * 100).toFixed(2)}%`);
      bodyStyle.setProperty("--light-size", "20%");
      bodyStyle.setProperty("--light-opacity", "0.82");
    }

    function formatTime(totalSeconds) {
      const safeSeconds = Math.max(0, Math.ceil(totalSeconds));
      const minutes = Math.floor(safeSeconds / 60);
      const seconds = safeSeconds % 60;
      return `${String(minutes).padStart(2, "0")}:${String(seconds).padStart(2, "0")}`;
    }

    function openDialogue(config) {
      state.ui.currentDialogue = {
        ...config,
        choices: (config.choices || []).map((choice) => ({ ...choice })),
      };
      state.ui.selectedChoiceIndex = 0;
      startTimer(
        Math.round((config.timerSeconds || 0) * (difficulty.timerMultiplier || 1)),
        () => {
          if (config.choices && config.choices.length) {
            resolveDialogueChoice(config.choices[config.choices.length - 1].id);
          }
        },
      );
      renderDialogue();
    }

    function closeDialogue() {
      state.ui.currentDialogue = null;
      state.ui.selectedChoiceIndex = 0;
      clearTimer();
      renderDialogue();
    }

    function showLevelOverlay(config, onContinue) {
      state.ui.levelOverlay = {
        ...config,
        onContinue: typeof onContinue === "function" ? onContinue : null,
      };

      if (ui.levelKicker) {
        ui.levelKicker.textContent = config.kicker;
      }
      if (ui.levelTitle) {
        ui.levelTitle.textContent = config.title;
      }
      if (ui.levelBody) {
        ui.levelBody.textContent = config.body;
      }
      if (ui.levelOverlay) {
        ui.levelOverlay.classList.add("is-active");
      }
    }

    function hideLevelOverlay() {
      if (ui.levelOverlay) {
        ui.levelOverlay.classList.remove("is-active");
      }
      state.ui.levelOverlay = null;
    }

    function handleLevelOverlayInput() {
      if (!state.ui.levelOverlay) {
        return false;
      }
      if (!input.consumePressed("Enter") && !input.consumePressed("Space")) {
        return true;
      }

      const pending = state.ui.levelOverlay;
      hideLevelOverlay();
      if (pending.onContinue) {
        pending.onContinue();
      }
      return true;
    }

    function renderDialogue() {
      if (!ui.dialogueBox) {
        return;
      }
      const dialogue = state.ui.currentDialogue;
      if (!dialogue) {
        ui.dialogueBox.classList.remove("is-active");
        ui.dialogueBox.classList.remove("is-centered");
        return;
      }

      ui.dialogueBox.classList.add("is-active");
      ui.dialogueBox.classList.toggle("is-game-over", Boolean(state.systems.gameOver));
      ui.dialogueBox.classList.toggle("is-centered", Boolean(dialogue.centered));
      ui.dialogueKicker.textContent = dialogue.kicker || (
        state.systems.gameOver
          ? "Run Ended"
          : (state.timers.active ? `Decision - ${Math.ceil(state.timers.active.remaining)}s` : "Decision")
      );
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
      if (!state.timers.active || state.ui.levelOverlay || state.systems.gameOver) {
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

    function showGameOver(title, body) {
      if (state.systems.gameOver) {
        return;
      }
      const endingPenaltyType = title === "Battery Dead" ? "batteryDeath" : "timeout";
      applyEndingScore(endingPenaltyType);
      state.systems.gameOver = true;
      state.systems.gameOverReason = title;
      hideLevelOverlay();
      if (audio && typeof audio.stopAll === "function") {
        audio.stopAll();
      }
      closeDialogue();
      setTaskQueue([]);
      setInteractionHint("Game over. Refresh the page to play again.");
      state.ui.currentDialogue = {
        kicker: title,
        title: "GAME OVER",
        body: `${body} ${getRunSummaryText()}`,
        choices: [],
      };
      document.body.classList.remove("end-safe", "end-almost");
      document.body.classList.add("end-dark");
      renderDialogue();
      if (state.timers.menuRedirectTimeoutId) {
        window.clearTimeout(state.timers.menuRedirectTimeoutId);
      }
      state.timers.menuRedirectTimeoutId = window.setTimeout(() => {
        state.timers.menuRedirectTimeoutId = 0;
        returnToMainMenu();
      }, 4000);
    }

    function updateNightClock(dt) {
      if (!state.ui.levelOverlay && !state.systems.gameOver && !state.systems.familySafe) {
        state.systems.night.remaining = Math.max(0, state.systems.night.remaining - dt);
      }
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
        return Math.hypot(playerCenter.x - targetX, playerCenter.y - targetY)
          <= maxDistance;
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
    }

    function triggerEvent01() {
      state.events.activeEventId = "event01";
      if (audio) {
        audio.onEvent("event01");
      }
      setTaskQueue([
        { id: "checkTv", label: getTaskLabel("checkTv", "Walk to the TV."), completed: false },
        { id: "checkRadio", label: getTaskLabel("checkRadio", "Go to the kitchen radio."), completed: false },
        { id: "checkPhone", label: getTaskLabel("checkPhone", "Check the phone."), completed: false },
      ]);
    }

    function triggerEvent02() {
      if (state.events.completed.event02) {
        return;
      }

      completeTask(TASK_IDS.reachChildrenRoom);
      state.events.activeEventId = "event02";
      setTaskQueue([
        { id: "goToChild", label: getTaskLabel("goToChild", "Go to the younger child."), completed: false },
        { id: "answerChild", label: getTaskLabel("answerChild", "Answer the question."), completed: false },
      ]);
      setInteractionHint(
        getHintText(
          "reachChildAndInteract",
          `Go to the younger child and ${getPromptText("interact", "Press SPACE to interact.").toLowerCase()}`,
        ),
      );
    }

    function triggerEvent03() {
      if (state.events.blackoutStarted) {
        return;
      }
      state.events.blackoutStarted = true;
      state.events.activeEventId = "event03";
      state.systems.blackout = true;
      if (audio) {
        audio.onEvent("event03");
      }
      setTaskQueue([
        { id: "reachKitchen", label: getTaskLabel("reachKitchen", "Run to the kitchen."), completed: false },
        { id: "openDrawer", label: getTaskLabel("openDrawer", "Open the third drawer."), completed: false },
        { id: "findCandle", label: getTaskLabel("findCandle", "Take the candle."), completed: false },
        { id: "lightCandle", label: getTaskLabel("lightCandle", "Light the candle."), completed: false },
      ]);
      setInteractionHint(getHintText("blackoutStart", "The room is dark now. Go to the kitchen and find the candle."));
    }

    function triggerEvent04() {
      if (state.events.completed.event04) {
        return;
      }
      state.events.activeEventId = "event04";
      if (audio) {
        audio.onEvent("event04");
      }
      setTaskQueue([
        { id: "goToDoor", label: getTaskLabel("goToDoor", "Go to the front door."), completed: false },
        { id: "checkChild", label: getTaskLabel("checkChild", "Find the older child."), completed: false },
        { id: "hideOrRespond", label: getTaskLabel("hideOrRespond", "Stay quiet or answer."), completed: false },
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

    function triggerEvent06() {
      state.events.activeEventId = "event06";
      if (audio) {
        audio.onEvent("event05");
      }
      triggerAlarmPulse();
      setTaskQueue([
        {
          id: TASK_IDS.goToBasement,
          label: getTaskLabel("goToBasement", "Take everyone to the basement."),
          completed: state.room.currentRoomId === "basement",
        },
        {
          id: TASK_IDS.waitForDawn,
          label: getTaskLabel("waitForDawn", "Wait for dawn."),
          completed: false,
        },
      ]);
      setInteractionHint("Alarm: time is running out and the battery is close to dying. Get the family to the basement and stay in the safe corner.");
    }

    function returnToMainMenu() {
      if (audio && typeof audio.stopAll === "function") {
        audio.stopAll();
      }
      window.location.href = "index.html";
    }

    function beginMorningEnding() {
      state.systems.familySafe = true;
      applyEndingScore("good");
      clearTimer();
      state.events.activeEventId = "event06-complete";
      setTaskQueue([]);
      setInteractionHint("The family is safe now. Wait a little until morning.");
      openDialogue({
        kicker: "Family Safe",
        title: "WAIT A LITTLE LONGER",
        body: `Stay close. Stay quiet. Morning is almost here. ${getRunSummaryText()}`,
        centered: true,
        choices: [],
        timerSeconds: 0,
      });
      updateHud();

      if (state.timers.morningTimeoutId) {
        window.clearTimeout(state.timers.morningTimeoutId);
      }

      state.timers.morningTimeoutId = window.setTimeout(() => {
        state.timers.morningTimeoutId = 0;
        closeDialogue();
        showLevelOverlay({
          ...LEVEL_COPY.level6Complete,
          body: `${LEVEL_COPY.level6Complete.body} ${getRunSummaryText()}`,
        }, returnToMainMenu);
        setInteractionHint("Morning came. You kept the family safe from the strangers outside.");
        if (state.timers.menuRedirectTimeoutId) {
          window.clearTimeout(state.timers.menuRedirectTimeoutId);
        }
        state.timers.menuRedirectTimeoutId = window.setTimeout(() => {
          state.timers.menuRedirectTimeoutId = 0;
          returnToMainMenu();
        }, 6000);
      }, 11000);
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

    function resolveDialogueChoice(choiceId) {
      const dialogue = state.ui.currentDialogue;
      if (!dialogue || state.systems.gameOver) {
        return;
      }

      const activeEventId = state.events.activeEventId;
      closeDialogue();

      if (activeEventId === "event01") {
        state.events.completed.event01 = true;
        state.events.choiceHistory.event01 = choiceId;
        awardChoiceScore("event01", choiceId);
        let event01Outcome = getOutcomeText("event01", "tvChosen", "You decide to trust the TV.");

        if (choiceId === "trustRadio") {
          addThreatDelta(0.5);
          event01Outcome = getOutcomeText("event01", "radioChosen", "You decide to trust the radio.");
        } else if (choiceId === "trustPhone") {
          addThreatDelta(1);
          addBatteryDelta(-2);
          event01Outcome = getOutcomeText("event01", "phoneChosen", "You decide to trust the phone.");
        } else {
          setThreat(2);
        }
        if (state.systems.threat < 2) {
          setThreat(2);
        }
        showLevelOverlay(LEVEL_COPY.level1Complete, () => {
          showLevelOverlay(LEVEL_COPY.level2Start, () => {
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
          });
        });
        return;
      }

      if (activeEventId === "event02") {
        state.events.completed.event02 = true;
        state.events.choiceHistory.event02 = choiceId;
        awardChoiceScore("event02", choiceId);
        completeTask("goToChild");
        completeTask("answerChild");
        let event02Outcome = getOutcomeText("event02", "childComforted", "The child steps closer. The counting stops.");

        if (choiceId === "reassure") {
          addThreatDelta(0.5);
        } else if (choiceId === "deflect") {
          addThreatDelta(1);
          event02Outcome = getOutcomeText("event02", "childUnsettled", "The child nods, but does not move.");
        } else {
          addThreatDelta(1.5);
          event02Outcome = getOutcomeText("event02", "childWithdraws", "The child looks at you for a moment, then looks away.");
        }
        showLevelOverlay(LEVEL_COPY.level2Complete, () => {
          showLevelOverlay(LEVEL_COPY.level3Start, () => {
            triggerEvent03();
            setInteractionHint(`${event02Outcome} ${getHintText("blackoutStart", "The room is dark now. Go to the kitchen and find the candle.")}`);
          });
        });
        return;
      }

      if (activeEventId === "event04") {
        state.events.completed.event04 = true;
        state.events.choiceHistory.event04 = choiceId;
        awardChoiceScore("event04", choiceId);
        completeTask("hideOrRespond");
        let event04Outcome = getOutcomeText("event04", "doorStaysClosed", "You stay still. The silence stretches.");

        if (choiceId === "speakThroughDoor") {
          addThreatDelta(1);
          event04Outcome = getOutcomeText("event04", "presenceRevealed", "Your voice gives the apartment away.");
        } else if (choiceId === "moveAway") {
          addThreatDelta(-0.5);
          event04Outcome = getOutcomeText("event04", "childRedirected", "You turn from the door and go to the older child first.");
        }
        showLevelOverlay(LEVEL_COPY.level4Complete, () => {
          showLevelOverlay(LEVEL_COPY.level5Start, () => {
            triggerEvent05();
            setInteractionHint(`${event04Outcome} ${getHintText("returnToChildren", "Take the candle back to the children.")}`);
          });
        });
        return;
      }

      if (activeEventId === "event05") {
        state.events.completed.event05 = true;
        state.events.choiceHistory.event05 = choiceId;
        awardChoiceScore("event05", choiceId);
        completeTask(TASK_IDS.checkYoungerChildAgain);
        completeTask(TASK_IDS.stayWithFamily);
        showLevelOverlay(LEVEL_COPY.level5Complete, () => {
          showLevelOverlay(LEVEL_COPY.level6Notice, () => {
            showLevelOverlay(LEVEL_COPY.level6Start, () => {
              triggerEvent06();
              setInteractionHint(
                `${getOutcomeText("event05", "familyHeldTogether", "The candle burns low, but everyone is still here.")} Alarm: time is running out and the battery is close to dying. Get the family to the basement and wait in the safe corner.`,
              );
            });
          });
        });
      }
    }

    function maybeOpenEvent01Dialogue() {
      if (state.events.completed.event01 || !areTasksComplete()) {
        return;
      }
      setInteractionHint(getHintText("chooseSource", "Choose which source to trust."));
      openDialogue(COPY.event01);
    }

    function maybeTriggerRoomEvents() {
      if (
        state.events.questionUnlocked
        && !state.events.completed.event02
        && state.room.currentRoomId === "children-room"
      ) {
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

      if (state.events.activeEventId === "event06" && state.room.currentRoomId === "basement") {
        completeTask(TASK_IDS.goToBasement);
        if (!state.ui.currentDialogue && !isTaskComplete(TASK_IDS.waitForDawn)) {
          setInteractionHint("Stay in the safe corner and wait for dawn.");
        }
      }

      if (state.events.activeEventId === "event04" && !state.ui.currentDialogue && isEvent04DecisionReady()) {
        setInteractionHint("Decision ready. Press E or SPACE on the front door or the older child to choose what to do.");
      }
    }

    function handleInteractable(interactable) {
      if (!interactable || state.systems.gameOver) {
        return;
      }

      if (audio) {
        audio.onInteractable(interactable.id);
      }

      markInteraction(interactable.id);

      switch (interactable.id) {
        case "tv":
          if (state.events.activeEventId === "event01") {
            state.events.interacted.tv = true;
            completeTask("checkTv");
            maybeOpenEvent01Dialogue();
          }
          setInteractionHint(
            getRepeatedLine(
              "tv",
              [
                getText(["dialogue", "tv", "intro"], "The TV keeps flickering through the signal."),
                getText(["dialogue", "tv", "warning"], "Stay indoors until further notice. Do not gather near windows."),
                getText(["dialogue", "tv", "staticBreak"], "The screen crackles. Half a sentence disappears into static."),
              ],
              "The TV keeps flickering through the signal.",
            ),
          );
          break;
        case "radio":
          if (state.events.activeEventId === "event01") {
            state.events.interacted.radio = true;
            completeTask("checkRadio");
            maybeOpenEvent01Dialogue();
          }
          if (!state.inventory.charger) {
            state.inventory.charger = true;
            addBatteryDelta(12);
            setInteractionHint("You feel around behind the radio and find the phone charger. Battery +12%.");
            break;
          }
          setInteractionHint(
            getRepeatedLine(
              "radio",
              [
                getText(["dialogue", "radio", "static"], "The radio sounds clearer than the TV, but not safer."),
                getText(["dialogue", "radio", "news"], "A voice on the radio says the roads are still open, but only for a little while."),
                getText(["dialogue", "radio", "dawnWord"], "The radio crackles once, then goes thin and quiet again."),
              ],
              "The radio sounds clearer than the TV, but not safer.",
            ),
          );
          break;
        case "phone":
          if (state.events.activeEventId === "event01") {
            state.events.interacted.phone = true;
            completeTask("checkPhone");
            maybeOpenEvent01Dialogue();
          }
          if (state.systems.battery <= 0) {
            setInteractionHint(getText(["dialogue", "phone", "deadScreen"], "The screen goes black."));
          } else if (state.systems.blackout && !state.systems.candleLit) {
            setInteractionHint(getText(["dialogue", "phone", "neighborMessage"], "Are you awake? I heard something outside."));
          } else if (state.systems.battery <= 10) {
            setInteractionHint(getText(["dialogue", "phone", "lowBatteryWarning"], "Battery low."));
          } else {
            setInteractionHint(
              getRepeatedLine(
                "phone",
                [
                  getText(["dialogue", "phone", "familyMessage"], "Keep the lights low. Message me if it gets worse."),
                  getText(["dialogue", "phone", "neighborMessage"], "Are you awake? I heard something outside."),
                  getText(["dialogue", "phone", "autocorrectDraft"], "stay safe"),
                ],
                "The phone is still working, but the battery is low.",
              ),
            );
          }
          break;
        case "youngerChild":
          if (state.events.activeEventId === "event02") {
            completeTask("goToChild");
            openDialogue(COPY.event02);
          } else if (state.events.activeEventId === "event05" && !state.events.completed.event05) {
            state.events.carryingChildren = true;
            completeTask(TASK_IDS.checkYoungerChildAgain);
            openDialogue(COPY.event05);
          } else {
            setInteractionHint(
              getRepeatedLine(
                "youngerChild",
                [
                  getText(["dialogue", "youngerChild", "comforted"], "Okay. Can I stay here for a little while?"),
                  getText(["dialogue", "youngerChild", "counting", 0], "One..."),
                  getText(["dialogue", "youngerChild", "dawnLine"], "Is it morning now?"),
                ],
                "The younger child stays close.",
              ),
            );
          }
          break;
        case "familyDrawing":
          addThreatDelta(-0.25);
          setInteractionHint(
            getRepeatedLine(
              "familyDrawing",
              [
                "A family drawing is taped to the wall. All four of you are standing in sunlight.",
                "The crayon lines shake a little at the edges. The child who drew it made everyone hold hands.",
                "You look at it too long. It helps anyway.",
              ],
              "The family drawing steadies you for a second.",
            ),
          );
          break;
        case "kitchenDrawer3":
          if (state.events.activeEventId === "event03") {
            if (!state.inventory.candle) {
              completeTask("openDrawer");
              state.inventory.candle = true;
              completeTask("findCandle");
              setInteractionHint(getHintText("relightCandle", "Press E or SPACE again on the drawer to light the candle."));
            } else if (!state.systems.candleLit) {
              state.systems.candleLit = true;
              completeTask("lightCandle");
              addScore(scoreConfig.milestones.event03Lit || 0);
              state.events.completed.event03 = true;
              showLevelOverlay(LEVEL_COPY.level3Complete, () => {
                showLevelOverlay(LEVEL_COPY.level4Start, () => {
                  triggerEvent04();
                  setInteractionHint(
                    `${getHintText("event03Complete", "The flame catches. The apartment comes back in pieces.")} ${getHintText("frontDoorChoice", "Someone is at the door. Go there or check on the older child.")}`,
                  );
                });
              });
            }
          } else if (state.inventory.candle) {
            setInteractionHint("The third drawer is still open. The candle used to be here.");
          } else {
            setInteractionHint("The third drawer sticks a little before it gives.");
          }
          break;
        case "kitchenDrawer2":
          if (!state.inventory.basementKey) {
            state.inventory.basementKey = true;
            setInteractionHint("Inside the second drawer, you find a small basement key and keep it with you.");
          } else {
            setInteractionHint(
              getRepeatedLine(
                "kitchenDrawer2",
                [
                  "The second drawer holds dishcloths, old batteries, and the empty space where the key was.",
                  "Nothing else here will help tonight.",
                ],
                "Nothing else here will help tonight.",
              ),
            );
          }
          break;
        case "frontDoor":
          if (state.events.activeEventId === "event04") {
            completeTask("goToDoor");
            if (isEvent04DecisionReady()) {
              openDialogue(COPY.event04);
            } else {
              setInteractionHint("Check on the older child before deciding what to do at the door.");
            }
          } else {
            setInteractionHint(
              getRepeatedLine(
                "frontDoor",
                [
                  "You rest your hand on the front door and feel how thin it is.",
                  "Nothing comes through the wood now, but that does not make it feel safe.",
                ],
                "The front door stays shut.",
              ),
            );
          }
          break;
        case "olderChild":
          if (state.events.activeEventId === "event04") {
            completeTask("checkChild");
            if (isEvent04DecisionReady()) {
              openDialogue(COPY.event04);
            } else if (isTaskComplete("goToDoor")) {
              setInteractionHint("Decision ready. Press E or SPACE again here or at the front door to choose what to do.");
            } else {
              setInteractionHint(getHintText("frontDoorChild", getText(["dialogue", "olderChild", "duringKnock"], "The older child hesitates near the front of the room.")));
            }
          } else {
            setInteractionHint(
              getRepeatedLine(
                "olderChild",
                [
                  getText(["dialogue", "olderChild", "restless"], "I heard something near the door."),
                  getText(["dialogue", "olderChild", "sentBack"], "Okay. I'll stay here."),
                  "The older child watches you instead of the hallway this time.",
                ],
                "The older child stays close, but alert.",
              ),
            );
          }
          break;
        case "safeCorner":
          if (state.events.activeEventId === "event06" && !state.events.completed.event06 && isTaskComplete(TASK_IDS.goToBasement)) {
            state.events.completed.event06 = true;
            completeTask(TASK_IDS.waitForDawn);
            applyEndingState();
            beginMorningEnding();
          } else if (state.events.activeEventId === "event06") {
            setInteractionHint("Get to the basement first, then wait in the safe corner.");
          } else {
            setInteractionHint("It feels safer here.");
          }
          break;
        case "basementDoor":
          if (state.events.activeEventId === "event06") {
            setInteractionHint("Too dangerous. Stay away from the outside door and move deeper into the basement.");
          } else if (!state.inventory.basementKey) {
            setInteractionHint("The basement drawer is locked. There should be a key for it somewhere upstairs.");
          } else {
            setInteractionHint(
              getRepeatedLine(
                "basementDoor",
                [
                  "You unlock the drawer, but inside there is only old paper, a broken torch, and dust.",
                  "At least it is one less closed thing in the house.",
                ],
                "The basement drawer hangs open now.",
              ),
            );
          }
          break;
        case "toyRobot":
          if (!state.inventory.robotOff) {
            state.inventory.robotOff = true;
            addThreatDelta(-0.5);
            setInteractionHint(getHintText("toyRobotOff", "The toy robot is silent now."));
          } else {
            setInteractionHint("The toy robot stays quiet in your hand.");
          }
          break;
        case "wallClock":
          setInteractionHint(
            getRepeatedLine(
              "wallClock",
              [
                "The wall clock sounds louder than it should. Every second feels like it belongs to the whole apartment.",
                "You count three ticks before you realize you are holding your breath.",
                "The clock keeps moving whether anyone is ready or not.",
              ],
              "The wall clock keeps time without mercy.",
            ),
          );
          break;
        case "cat":
          setInteractionHint(
            getRepeatedLine(
              "cat",
              [
                "The cat stares at you from the kitchen corner, tail curled tight.",
                "It slips away from your hand, then settles where it can still see the doorway.",
                "The cat is still here. Somehow that helps.",
              ],
              "The cat watches the room in silence.",
            ),
          );
          break;
        case "basementStairs":
          setInteractionHint(
            getRepeatedLine(
              "basementStairs",
              [
                "The basement stairs creak under even the smallest shift of weight.",
                "Looking up the stairs makes the house feel longer than it is.",
                "The stairs are still your fastest way back up.",
              ],
              "The basement stairs wait in the dark.",
            ),
          );
          break;
        default:
          setInteractionHint(`${interactable.label}.`);
          break;
      }
    }

    function handleChoiceInput() {
      const dialogue = state.ui.currentDialogue;
      if (!dialogue || !dialogue.choices.length || state.systems.gameOver) {
        return;
      }

      if (input.consumePressed("ArrowUp")) {
        state.ui.selectedChoiceIndex = (state.ui.selectedChoiceIndex + dialogue.choices.length - 1)
          % dialogue.choices.length;
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
      if (!state.systems.gameOver && !state.systems.familySafe && state.systems.blackout && !state.systems.candleLit) {
        addBatteryDelta(-dt * BATTERY_DRAIN_PER_SECOND);
      }
    }

    function maybeTriggerGameOver() {
      if (state.systems.gameOver || state.systems.familySafe) {
        return;
      }
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
        if (audio) {
          audio.setMovementActive(false, dt);
        }
        return;
      }

      const vector = window.MovementController.getMovementVector(input.keys);
      const dx = vector.dx;
      const dy = vector.dy;
      const spriteSize = window.PlayerRenderer.getSpriteSize(sprite);

      if (dx === 0 && dy === 0) {
        state.player.frame = 0;
        if (audio) {
          audio.setMovementActive(false, dt);
        }
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
      const currentRoom = getCurrentRoom();

      state.player.position = window.MovementController.resolveRoomCollision(
        state.player.position,
        {
          x: state.player.position.x + dx * speed * dt,
          y: state.player.position.y + dy * speed * dt,
        },
        state.room.bounds,
        spriteSize,
        currentRoom,
      );

      if (audio) {
        audio.setMovementActive(true, dt);
      }

      state.animation.elapsed += dt;
      const fps = window.MovementController.getAnimationFps(input, window.PlayerConfig.fps);
      if (state.animation.elapsed >= 1 / fps) {
        const maxCols = window.PlayerConfig.animationColumns[state.player.direction] || sprite.cols;
        state.player.frame = (state.player.frame + 1) % maxCols;
        state.animation.elapsed = 0;
      }
    }

    function findActiveGate(spriteSize) {
      if (gateCooldown > 0) {
        return null;
      }

      const currentRoom = getCurrentRoom();
      if (!currentRoom || !currentRoom.gates) {
        return null;
      }

      for (const gate of currentRoom.gates) {
        if (isGateTriggered(gate, spriteSize)) {
          return gate;
        }
      }

      return null;
    }

    function trySwitchRoom(spriteSize) {
      if (!currentGate || state.ui.levelOverlay || state.systems.gameOver || !input.consumePressed("KeyE")) {
        return;
      }

      // Touching a gate only prepares the transition.
      // Pressing E performs the room change intentionally.
      state.room.currentRoomId = currentGate.targetRoomId;
      state.room.visited[currentGate.targetRoomId] = true;
      state.player.position = getSafeSpawnPosition(
        currentGate.spawn,
        spriteSize,
        currentGate.targetRoomId,
      );
      state.player.frame = 0;
      if (audio) {
        audio.setRoom(currentGate.targetRoomId);
      }
      maybeTriggerRoomEvents();
      currentGate = null;
      gateCooldown = 0.2;
    }

    function isGateTriggered(gate, spriteSize) {
      const footProbe = window.MovementController.getFootProbe(
        state.player.position,
        spriteSize,
        state.room.bounds,
      );
      const xRatio = footProbe.x;
      const yRatio = footProbe.y;
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
      return getSafeSpawnPosition(spawn, spriteSize, state.room.currentRoomId);
    }

    function render() {
      const currentRoom = getCurrentRoom();
      const backgroundImage = currentRoom ? state.room.images[currentRoom.id] : null;
      const nearbyInteractable = getNearbyInteractable();

      window.PlayerRenderer.drawRoom(context, canvas, {
        backgroundImage,
        roomId: currentRoom ? currentRoom.id : "",
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
        {
          carryChildren: state.events.carryingChildren && !state.systems.familySafe,
          showCandle: state.systems.candleLit,
        },
      );
      drawCollisionDebugOverlay(currentRoom, window.PlayerRenderer.getSpriteSize(sprite));
    }

    function updateInteractionState() {
      if (state.ui.levelOverlay || state.systems.gameOver) {
        return;
      }

      const interactable = getNearbyInteractable();
      const gateHint = currentGate ? getGateHint(currentGate) : "";

      const interactKeyHint = getPromptText("interact", "Press E or SPACE to interact.");

      if (interactable && gateHint) {
        setInteractionHint(`${gateHint}. ${interactKeyHint.replace(" to interact.", "")}: ${interactable.label}`);
      } else if (interactable) {
        setInteractionHint(`${interactKeyHint.replace(" to interact.", "")}: ${interactable.label}`);
      } else if (gateHint) {
        setInteractionHint(gateHint);
      }

      const pressedInteract = input.consumePressed("Space")
        || (!currentGate && input.consumePressed("KeyE"));

      if (pressedInteract && interactable) {
        handleInteractable(interactable);
      }
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
      updateGateCooldown(dt);
      currentGate = findActiveGate(spriteSize);
      maybeTriggerRoomEvents();
      updateTimer(dt);
      updateNightClock(dt);
      updateBattery(dt);
      maybeTriggerGameOver();
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
    }

    function loadRoomImages() {
      ROOM_IDS.forEach((roomId) => {
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
        if (state.timers.morningTimeoutId) {
          window.clearTimeout(state.timers.morningTimeoutId);
        }
        if (state.timers.menuRedirectTimeoutId) {
          window.clearTimeout(state.timers.menuRedirectTimeoutId);
        }
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
