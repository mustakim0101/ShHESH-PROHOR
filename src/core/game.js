(function () {
  function createGame(options) {
    const room = options.room;
    const player = options.player;
    const sprite = { ...window.PlayerConfig.sprite };
    const input = window.InputController.createInputController(window);
    const roomRegistry = window.RoomRegistry;

    let currentRoomId = "living-room";
    let position = { x: 0, y: 0 };
    let roomBounds = null;
    let lastTime = performance.now();
    let animationTime = 0;
    let frame = 0;
    let direction = 0;

    function getCurrentRoom() {
      return roomRegistry.getRoom(currentRoomId);
    }

    function applyRoomVisuals() {
      const currentRoom = getCurrentRoom();
      if (!currentRoom) {
        return;
      }

      room.style.backgroundImage = `url("${currentRoom.background}")`;
      room.dataset.roomId = currentRoom.id;
    }

    function updateRoomBounds() {
      const rect = room.getBoundingClientRect();
      const spriteSize = window.PlayerRenderer.getSpriteSize(sprite);
      roomBounds = { width: rect.width, height: rect.height };
      position = window.MovementController.clampPosition(position, roomBounds, spriteSize);
    }

    function updateFrame() {
      window.PlayerRenderer.setPlayerFrame(
        player,
        sprite,
        window.PlayerConfig.animationColumns,
        direction,
        frame,
      );
    }

    function updatePosition(dt) {
      const vector = window.MovementController.getMovementVector(input.keys);
      const dx = vector.dx;
      const dy = vector.dy;
      const spriteSize = window.PlayerRenderer.getSpriteSize(sprite);

      if (dx === 0 && dy === 0) {
        frame = 0;
        return;
      }

      const nextDirection = window.MovementController.getDirection(direction, dx, dy);
      if (nextDirection !== direction) {
        direction = nextDirection;
        frame = 0;
      } else {
        direction = nextDirection;
      }

      const speed = window.MovementController.getMoveSpeed(input, window.PlayerConfig.speed);

      position = window.MovementController.clampPosition(
        {
          x: position.x + dx * speed * dt,
          y: position.y + dy * speed * dt,
        },
        roomBounds,
        spriteSize,
      );

      animationTime += dt;
      const fps = window.MovementController.getAnimationFps(input, window.PlayerConfig.fps);
      if (animationTime >= 1 / fps) {
        const maxCols = window.PlayerConfig.animationColumns[direction] || sprite.cols;
        frame = (frame + 1) % maxCols;
        animationTime = 0;
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

        currentRoomId = gate.targetRoomId;
        applyRoomVisuals();
        position = getSpawnPosition(gate.spawn, spriteSize);
        frame = 0;
        return;
      }
    }

    function isGateTriggered(gate, spriteSize) {
      const playerCenterX = position.x + spriteSize.width * 0.5;
      const playerCenterY = position.y + spriteSize.height * 0.5;
      const xRatio = playerCenterX / roomBounds.width;
      const yRatio = playerCenterY / roomBounds.height;
      const threshold = gate.threshold || 24;

      if (gate.side === "left") {
        return position.x <= threshold && yRatio >= gate.range.start && yRatio <= gate.range.end;
      }

      if (gate.side === "right") {
        return position.x + spriteSize.width >= roomBounds.width - threshold
          && yRatio >= gate.range.start
          && yRatio <= gate.range.end;
      }

      if (gate.side === "top") {
        return position.y <= threshold && xRatio >= gate.range.start && xRatio <= gate.range.end;
      }

      if (gate.side === "bottom") {
        return position.y + spriteSize.height >= roomBounds.height - threshold
          && xRatio >= gate.range.start
          && xRatio <= gate.range.end;
      }

      return false;
    }

    function getSpawnPosition(spawn, spriteSize) {
      return window.MovementController.clampPosition(
        {
          x: (roomBounds.width - spriteSize.width) * spawn.x,
          y: (roomBounds.height - spriteSize.height) * spawn.y,
        },
        roomBounds,
        spriteSize,
      );
    }

    function loop(now) {
      const dt = Math.min(0.05, (now - lastTime) / 1000);
      lastTime = now;

      updatePosition(dt);
      window.PlayerRenderer.renderPlayerPosition(player, position);
      updateFrame();

      requestAnimationFrame(loop);
    }

    function init() {
      const image = new Image();

      image.onload = () => {
        sprite.sheetW = image.width;
        sprite.sheetH = image.height;

        applyRoomVisuals();
        window.PlayerRenderer.applyPlayerStyle(player, sprite);
        updateRoomBounds();

        const spriteSize = window.PlayerRenderer.getSpriteSize(sprite);
        position = getSpawnPosition({ x: 0.5, y: 0.65 }, spriteSize);

        updateFrame();
        window.PlayerRenderer.renderPlayerPosition(player, position);
        requestAnimationFrame(loop);
      };

      image.onerror = () => {
        console.error("Failed to load sprite sheet:", sprite.url);
      };

      image.src = sprite.url;
      window.addEventListener("resize", updateRoomBounds);
    }

    return {
      init,
      destroy() {
        window.removeEventListener("resize", updateRoomBounds);
        input.dispose();
      },
    };
  }

  window.GameCore = {
    createGame,
  };
})();
