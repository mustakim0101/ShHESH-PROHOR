(function () {
  function createGame(options) {
    const canvas = options.canvas;
    const context = canvas.getContext("2d");
    const sprite = { ...window.PlayerConfig.sprite };
    const input = window.InputController.createInputController(window);
    const roomRegistry = window.RoomRegistry;
    const roomImages = {};

    let currentRoomId = "living-room";
    let position = { x: 0, y: 0 };
    let roomBounds = { width: canvas.width, height: canvas.height };
    let lastTime = performance.now();
    let animationTime = 0;
    let frame = 0;
    let direction = 0;
    let spriteImage = null;
    let animationFrameId = 0;

    function getCurrentRoom() {
      return roomRegistry.getRoom(currentRoomId);
    }

    function updateRoomBounds() {
      roomBounds = { width: canvas.width, height: canvas.height };
      const spriteSize = window.PlayerRenderer.getSpriteSize(sprite);
      position = window.MovementController.clampPosition(position, roomBounds, spriteSize);
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

      if (gate.area) {
        return xRatio >= gate.area.x.start
          && xRatio <= gate.area.x.end
          && yRatio >= gate.area.y.start
          && yRatio <= gate.area.y.end;
      }

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

    function render() {
      const currentRoom = getCurrentRoom();
      const backgroundImage = currentRoom ? roomImages[currentRoom.id] : null;

      window.PlayerRenderer.drawRoom(context, canvas, {
        backgroundImage,
      });
      window.PlayerRenderer.drawPlayer(
        context,
        spriteImage,
        sprite,
        window.PlayerConfig.animationColumns,
        direction,
        frame,
        position,
      );
    }

    function loop(now) {
      const dt = Math.min(0.05, (now - lastTime) / 1000);
      lastTime = now;

      updatePosition(dt);
      render();

      animationFrameId = requestAnimationFrame(loop);
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
        roomImages[roomId] = image;
      });
    }

    function init() {
      const image = new Image();

      image.onload = () => {
        sprite.sheetW = image.width;
        sprite.sheetH = image.height;
        spriteImage = image;

        loadRoomImages();
        resizeCanvas();

        const spriteSize = window.PlayerRenderer.getSpriteSize(sprite);
        position = getSpawnPosition({ x: 0.5, y: 0.65 }, spriteSize);

        render();
        animationFrameId = requestAnimationFrame(loop);
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
        cancelAnimationFrame(animationFrameId);
        window.removeEventListener("resize", resizeCanvas);
        input.dispose();
      },
    };
  }

  window.GameCore = {
    createGame,
  };
})();
