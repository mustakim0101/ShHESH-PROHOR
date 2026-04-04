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
    const walkableZones = room?.walkableZones;
    const blockedZones = room?.blockedZones || [];

    if (!Array.isArray(walkableZones) || walkableZones.length === 0) {
      return true;
    }

    const footProbe = getFootProbe(position, spriteSize, bounds);
    const insideWalkableZone = walkableZones.some((zone) => isInsideZone(footProbe, zone));
    const insideBlockedZone = blockedZones.some((zone) => isInsideZone(footProbe, zone));

    return insideWalkableZone && !insideBlockedZone;
  }

  function resolveRoomCollision(currentPosition, candidatePosition, bounds, spriteSize, room) {
    const clampedCandidate = clampPosition(candidatePosition, bounds, spriteSize);

    if (isWalkablePosition(clampedCandidate, bounds, spriteSize, room)) {
      return clampedCandidate;
    }

    const xOnly = clampPosition(
      { x: clampedCandidate.x, y: currentPosition.y },
      bounds,
      spriteSize,
    );

    if (isWalkablePosition(xOnly, bounds, spriteSize, room)) {
      return xOnly;
    }

    const yOnly = clampPosition(
      { x: currentPosition.x, y: clampedCandidate.y },
      bounds,
      spriteSize,
    );

    if (isWalkablePosition(yOnly, bounds, spriteSize, room)) {
      return yOnly;
    }

    return clampPosition(currentPosition, bounds, spriteSize);
  }

  window.MovementController = {
    clampPosition,
    getAnimationFps,
    getDirection,
    getFootProbe,
    getMovementVector,
    getMoveSpeed,
    isWalkablePosition,
    resolveRoomCollision,
  };
})();
