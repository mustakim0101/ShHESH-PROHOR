(function () {
  function createGame(options) {
    const room = options.room;
    const player = options.player;
    const sprite = { ...window.PlayerConfig.sprite };
    const input = window.InputController.createInputController(window);

    let position = { x: 0, y: 0 };
    let roomBounds = null;
    let lastTime = performance.now();
    let animationTime = 0;
    let frame = 0;
    let direction = 0;

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

      const spriteSize = window.PlayerRenderer.getSpriteSize(sprite);
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

        window.PlayerRenderer.applyPlayerStyle(player, sprite);
        updateRoomBounds();

        const spriteSize = window.PlayerRenderer.getSpriteSize(sprite);
        position = {
          x: roomBounds.width * 0.5 - spriteSize.width * 0.5,
          y: roomBounds.height * 0.65 - spriteSize.height * 0.5,
        };

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
