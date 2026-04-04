(function () {
  function createGame(options) {
    const canvas = options.canvas;
    const context = canvas.getContext("2d");
    const sprite = { ...window.PlayerConfig.sprite };
    const input = window.InputController.createInputController(window);
    const roomRegistry = window.RoomRegistry;
    const state = window.GameState.createGameState(canvas);

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

    function updatePosition(dt) {
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
        state.player.position = getSpawnPosition(gate.spawn, spriteSize);
        state.player.frame = 0;
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
      const backgroundImage = currentRoom
        ? state.room.images[currentRoom.id]
        : null;

      window.PlayerRenderer.drawRoom(context, canvas, {
        backgroundImage,
      });
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

    function loop(now) {
      const dt = Math.min(0.05, (now - state.animation.lastTime) / 1000);
      state.animation.lastTime = now;

      updatePosition(dt);
      render();

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
