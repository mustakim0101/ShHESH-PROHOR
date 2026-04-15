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

  function isValueInRange(value, range) {
    return value >= range.start && value <= range.end;
  }

  function getFootProbe(position, spriteSize, bounds) {
    return {
      x: (position.x + spriteSize.width * 0.5) / bounds.width,
      y: (position.y + spriteSize.height * 0.88) / bounds.height,
    };
  }

  function isInsideZone(point, zone) {
    return isValueInRange(point.x, zone.x) && isValueInRange(point.y, zone.y);
  }

  function isWalkablePosition(position, bounds, spriteSize, room) {
    return true;
  }

  function resolveRoomCollision(currentPosition, candidatePosition, bounds, spriteSize, room) {
    return clampPosition(candidatePosition, bounds, spriteSize);
  }

  function getCandidateOffsets(distance) {
    const offsets = [];

    for (let x = -distance; x <= distance; x += distance) {
      for (let y = -distance; y <= distance; y += distance) {
        if (x === 0 && y === 0) {
          continue;
        }

        offsets.push({ x, y });
      }
    }

    return offsets.sort((left, right) => Math.hypot(left.x, left.y) - Math.hypot(right.x, right.y));
  }

  function findNearestWalkablePosition(position, bounds, spriteSize, room) {
    return clampPosition(position, bounds, spriteSize);
  }

  window.MovementController = {
    clampPosition,
    findNearestWalkablePosition,
    getAnimationFps,
    getDirection,
    getFootProbe,
    getMovementVector,
    getMoveSpeed,
    isWalkablePosition,
    resolveRoomCollision,
  };
})();
