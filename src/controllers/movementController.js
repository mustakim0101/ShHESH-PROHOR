(function () {
  function isDown(code) {
    return code === "KeyS" || code === "ArrowDown";
  }

  function isUp(code) {
    return code === "KeyW" || code === "ArrowUp";
  }

  function isLeft(code) {
    return code === "KeyA" || code === "ArrowLeft";
  }

  function isRight(code) {
    return code === "KeyD" || code === "ArrowRight";
  }

  function getMovementVector(keys) {
    let dx = 0;
    let dy = 0;

    for (const code of keys) {
      if (isDown(code)) dy += 1;
      if (isUp(code)) dy -= 1;
      if (isLeft(code)) dx -= 1;
      if (isRight(code)) dx += 1;
    }

    if (dx === 0 && dy === 0) {
      return { dx: 0, dy: 0 };
    }

    const length = Math.hypot(dx, dy) || 1;
    return {
      dx: dx / length,
      dy: dy / length,
    };
  }

  function getDirection(currentDirection, dx, dy) {
    if (Math.abs(dx) > Math.abs(dy)) {
      return dx > 0 ? 2 : 1;
    }

    if (Math.abs(dy) > 0) {
      return dy > 0 ? 0 : 3;
    }

    return currentDirection;
  }

  function getMoveSpeed(input, speed) {
    const sprinting = input.isPressed("ShiftLeft") || input.isPressed("ShiftRight");
    return sprinting ? speed.sprint : speed.walk;
  }

  function getAnimationFps(input, fps) {
    const sprinting = input.isPressed("ShiftLeft") || input.isPressed("ShiftRight");
    return sprinting ? fps.sprint : fps.walk;
  }

  function clampPosition(position, bounds, spriteSize) {
    return {
      x: Math.max(0, Math.min(position.x, bounds.width - spriteSize.width)),
      y: Math.max(0, Math.min(position.y, bounds.height - spriteSize.height)),
    };
  }

  window.MovementController = {
    clampPosition,
    getAnimationFps,
    getDirection,
    getMovementVector,
    getMoveSpeed,
  };
})();
