(function () {
  const OBJECT_IMAGE_CONFIG = {
    tv: { path: "assets/images/objects/tv.png", scale: 4.6 },
    toyRobot: { path: "assets/images/objects/Robot.png", scale: 6.5 },
    radio: { path: "assets/images/objects/radio.png", scale: 4.0 },
    kitchenDrawer2: { path: "assets/images/objects/drawer.png", scale: 7.9 },
    kitchenDrawer3: { path: "assets/images/objects/drawer.png", scale: 7.9 },
    phone: { path: "assets/images/objects/telephone.png", scale: 3.5 },
    basementStairs: { path: "assets/images/objects/stair.png", scale: 3.4 },
    safeCorner: { path: "assets/images/objects/safePlace.png", scale: 5.5 },
  };
  const CARRIED_OLDER_CHILD_SPRITE = {
    path: "assets/images/characters/mom1.png",
    frameW: 64,
    frameH: 64,
    cols: 4,
    rows: 4,
  };
  const CARRIED_YOUNGER_CHILD_SPRITE = {
    path: "assets/images/characters/mom1.png",
    frameW: 64,
    frameH: 64,
    cols: 4,
    rows: 4,
  };

  const objectImages = {};
  let carriedOlderChildImage = null;
  let carriedYoungerChildImage = null;

  function getObjectImage(id) {
    const config = OBJECT_IMAGE_CONFIG[id];
    if (!config) {
      return null;
    }

    if (!objectImages[id]) {
      const image = new Image();
      image.src = config.path;
      objectImages[id] = image;
    }

    return objectImages[id];
  }

  function getCarriedOlderChildImage() {
    if (!carriedOlderChildImage) {
      carriedOlderChildImage = new Image();
      carriedOlderChildImage.src = CARRIED_OLDER_CHILD_SPRITE.path;
    }

    return carriedOlderChildImage;
  }

  function getCarriedYoungerChildImage() {
    if (!carriedYoungerChildImage) {
      carriedYoungerChildImage = new Image();
      carriedYoungerChildImage.src = CARRIED_YOUNGER_CHILD_SPRITE.path;
    }

    return carriedYoungerChildImage;
  }

  function getSpriteSize(sprite) {
    return {
      width: sprite.frameW * sprite.scale,
      height: sprite.frameH * sprite.scale,
    };
  }

  function getFrameSource(sprite, animationColumns, direction, frame) {
    const maxCols = animationColumns[direction] || sprite.cols;
    const safeFrame = frame % maxCols;
    const row = Math.min(direction, sprite.rows - 1);

    return {
      sx: safeFrame * sprite.frameW,
      sy: row * sprite.frameH,
      sw: sprite.frameW,
      sh: sprite.frameH,
    };
  }

  function drawRoom(context, canvas, roomState) {
    context.clearRect(0, 0, canvas.width, canvas.height);

    if (roomState.backgroundImage && roomState.backgroundImage.complete) {
      context.drawImage(roomState.backgroundImage, 0, 0, canvas.width, canvas.height);
    } else {
      context.fillStyle = "#14141f";
      context.fillRect(0, 0, canvas.width, canvas.height);
    }

    context.fillStyle = "rgba(0, 0, 0, 0.14)";
    context.fillRect(0, 0, canvas.width, canvas.height);

    if (roomState.roomId === "basement") {
      drawBasementTouchup(context, canvas);
    }
  }

  function drawBasementTouchup(context, canvas) {
    context.save();

    // Soften the harsh dark patches in the basement art while keeping the room moody.
    context.fillStyle = "rgba(74, 54, 64, 0.08)";
    context.fillRect(0, 0, canvas.width, canvas.height);

    const topGlow = context.createLinearGradient(0, 0, 0, canvas.height * 0.36);
    topGlow.addColorStop(0, "rgba(138, 112, 124, 0.14)");
    topGlow.addColorStop(1, "rgba(138, 112, 124, 0)");
    context.fillStyle = topGlow;
    context.fillRect(0, 0, canvas.width, canvas.height * 0.36);

    const rightSide = context.createLinearGradient(canvas.width * 0.78, 0, canvas.width, 0);
    rightSide.addColorStop(0, "rgba(96, 78, 88, 0)");
    rightSide.addColorStop(1, "rgba(96, 78, 88, 0.18)");
    context.fillStyle = rightSide;
    context.fillRect(canvas.width * 0.78, 0, canvas.width * 0.22, canvas.height * 0.78);

    const lowerCorner = context.createLinearGradient(canvas.width * 0.8, canvas.height * 0.66, canvas.width, canvas.height);
    lowerCorner.addColorStop(0, "rgba(0, 0, 0, 0)");
    lowerCorner.addColorStop(1, "rgba(84, 72, 104, 0.18)");
    context.fillStyle = lowerCorner;
    context.fillRect(canvas.width * 0.8, canvas.height * 0.66, canvas.width * 0.2, canvas.height * 0.34);

    context.restore();
  }

  function drawInteractables(context, canvas, interactables, activeItem) {
    if (!Array.isArray(interactables)) {
      return;
    }

    const pulse = (Math.sin(performance.now() * 0.008) + 1) * 0.5;

    interactables.forEach((item) => {
      const x = canvas.width * item.x;
      const y = canvas.height * item.y;
      const radius = Math.max(10, Math.round(Math.min(canvas.width, canvas.height) * item.radius * 0.3));
      const isActive = activeItem && item.id === activeItem.id;
      const image = getObjectImage(item.id);

      context.save();
      if (image && image.complete) {
        const scale = OBJECT_IMAGE_CONFIG[item.id].scale || 1.6;
        const activeBoost = isActive ? 1 + pulse * 0.08 : 1;
        const drawWidth = radius * scale * activeBoost;
        const aspectRatio = image.height > 0 ? image.width / image.height : 1;
        const drawHeight = drawWidth / Math.max(0.6, aspectRatio);
        const brightness = isActive ? 1.38 + pulse * 0.18 : 1;

        context.filter = `brightness(${brightness}) saturate(${isActive ? 1.12 : 1})`;

        if (isActive) {
          context.shadowColor = "rgba(255, 211, 125, 0.72)";
          context.shadowBlur = 18 + pulse * 10;
        }

        context.drawImage(
          image,
          x - drawWidth * 0.5,
          y - drawHeight * 0.5,
          drawWidth,
          drawHeight,
        );
      } else if (isActive) {
        const beamHeight = radius * 2.1;
        const beamWidth = radius * 1.1;
        const glow = context.createLinearGradient(x, y - beamHeight, x, y + beamHeight);
        glow.addColorStop(0, "rgba(255, 211, 125, 0)");
        glow.addColorStop(0.35, "rgba(255, 211, 125, 0.08)");
        glow.addColorStop(0.5, "rgba(255, 244, 214, 0.22)");
        glow.addColorStop(0.65, "rgba(255, 211, 125, 0.08)");
        glow.addColorStop(1, "rgba(255, 211, 125, 0)");
        context.fillStyle = glow;
        context.fillRect(x - beamWidth * 0.5, y - beamHeight, beamWidth, beamHeight * 2);
      }
      context.restore();
    });

    if (activeItem) {
      drawLabel(context, canvas, activeItem.label);
    }
  }

  function drawLabel(context, canvas, label) {
    context.save();
    context.font = '16px "JetBrains Mono", monospace';
    context.textAlign = "center";
    context.textBaseline = "middle";

    const textWidth = context.measureText(label).width;
    const boxWidth = textWidth + 34;
    const boxHeight = 36;
    const x = canvas.width * 0.5 - boxWidth * 0.5;
    const y = 18;

    context.fillStyle = "rgba(8, 8, 18, 0.88)";
    context.strokeStyle = "rgba(255, 196, 115, 0.9)";
    context.lineWidth = 2;
    context.beginPath();
    context.roundRect(x, y, boxWidth, boxHeight, 10);
    context.fill();
    context.stroke();

    context.fillStyle = "rgba(245, 245, 252, 0.98)";
    context.fillText(label, canvas.width * 0.5, y + boxHeight * 0.5);
    context.restore();
  }

  function getCandleAnchor(position, size, direction) {
    if (direction === 1) {
      return { x: position.x + size.width * 0.32, y: position.y + size.height * 0.56 };
    }

    if (direction === 2) {
      return { x: position.x + size.width * 0.66, y: position.y + size.height * 0.56 };
    }

    if (direction === 3) {
      return { x: position.x + size.width * 0.5, y: position.y + size.height * 0.44 };
    }

    return { x: position.x + size.width * 0.58, y: position.y + size.height * 0.54 };
  }

  function drawCarriedCandle(context, position, size, direction, strength = 1) {
    const anchor = getCandleAnchor(position, size, direction);
    const flicker = Math.sin(performance.now() * 0.014) * 1.2;
    const flameY = anchor.y - 10 + flicker * 0.35;
    const safeStrength = Math.max(0, Math.min(1, strength));
    const brightnessFactor = 0.35 + safeStrength * 0.65;

    context.save();

    // Keep the glow tiny so the candle reads as an object, not a spotlight.
    const glow = context.createRadialGradient(anchor.x, flameY, 1, anchor.x, flameY, 12);
    glow.addColorStop(0, `rgba(255, 226, 150, ${(0.26 * brightnessFactor).toFixed(3)})`);
    glow.addColorStop(0.55, `rgba(255, 184, 90, ${(0.12 * brightnessFactor).toFixed(3)})`);
    glow.addColorStop(1, "rgba(255, 184, 90, 0)");
    context.fillStyle = glow;
    context.beginPath();
    context.arc(anchor.x, flameY, 12, 0, Math.PI * 2);
    context.fill();

    context.fillStyle = "#f1e4cf";
    context.fillRect(anchor.x - 2, anchor.y - 8, 4, 10);

    context.fillStyle = "#ffcd68";
    context.beginPath();
    context.ellipse(anchor.x, flameY, 3.1, 4.6 * brightnessFactor, 0, 0, Math.PI * 2);
    context.fill();

    context.fillStyle = "#fff4bf";
    context.beginPath();
    context.ellipse(anchor.x, flameY - 0.6, 1.4, 2.2 * brightnessFactor, 0, 0, Math.PI * 2);
    context.fill();

    context.restore();
  }

  function drawCarriedChildren(context, position, size, direction) {
    const pulse = Math.sin(performance.now() * 0.008) * 0.5 + 0.5;
    const facingLeft = direction === 1;
    const facingRight = direction === 2;
    const shoulderY = position.y + size.height * 0.32;
    const centerX = position.x + size.width * 0.5;
    const olderChildX = facingLeft
      ? position.x + size.width * 0.15
      : facingRight
        ? position.x + size.width * 0.85
        : centerX + size.width * 0.24;
    const youngerChildX = facingLeft
      ? position.x + size.width * 0.72
      : facingRight
        ? position.x + size.width * 0.28
        : centerX - size.width * 0.23;
    const olderChildY = position.y + size.height * 0.12;
    const youngerChildY = position.y + size.height * 0.24;
    const bundleY = shoulderY + size.height * 0.11;
    const olderChildImage = getCarriedOlderChildImage();
    const youngerChildImage = getCarriedYoungerChildImage();
    const olderChildRow = Math.min(direction, CARRIED_OLDER_CHILD_SPRITE.rows - 1);
    const youngerChildRow = Math.min(direction, CARRIED_YOUNGER_CHILD_SPRITE.rows - 1);
    const olderChildFrame = direction === 0 ? 2 : 1;
    const youngerChildFrame = direction === 0 ? 1 : 0;
    const olderChildWidth = size.width * 0.5;
    const olderChildHeight = olderChildWidth * (CARRIED_OLDER_CHILD_SPRITE.frameH / CARRIED_OLDER_CHILD_SPRITE.frameW);
    const youngerChildWidth = size.width * 0.33;
    const youngerChildHeight = youngerChildWidth * (CARRIED_YOUNGER_CHILD_SPRITE.frameH / CARRIED_YOUNGER_CHILD_SPRITE.frameW);

    context.save();

    const wrapGlow = context.createRadialGradient(
      centerX,
      bundleY,
      6,
      centerX,
      bundleY,
      size.width * 0.62,
    );
    wrapGlow.addColorStop(0, `rgba(255, 231, 177, ${0.16 + pulse * 0.06})`);
    wrapGlow.addColorStop(1, "rgba(255, 231, 177, 0)");
    context.fillStyle = wrapGlow;
    context.beginPath();
    context.ellipse(centerX, bundleY, size.width * 0.68, size.height * 0.36, 0, 0, Math.PI * 2);
    context.fill();

    context.fillStyle = "rgba(28, 18, 30, 0.22)";
    context.beginPath();
    context.ellipse(centerX, bundleY + size.height * 0.13, size.width * 0.54, size.height * 0.17, 0, 0, Math.PI * 2);
    context.fill();

    if (olderChildImage.complete) {
      context.imageSmoothingEnabled = false;
      context.filter = `brightness(${1.04 + pulse * 0.04}) saturate(0.94)`;
      context.drawImage(
        olderChildImage,
        olderChildFrame * CARRIED_OLDER_CHILD_SPRITE.frameW,
        olderChildRow * CARRIED_OLDER_CHILD_SPRITE.frameH,
        CARRIED_OLDER_CHILD_SPRITE.frameW,
        CARRIED_OLDER_CHILD_SPRITE.frameH,
        olderChildX - olderChildWidth * 0.5,
        olderChildY,
        olderChildWidth,
        olderChildHeight,
      );
      context.filter = "none";
    }

    if (youngerChildImage.complete) {
      context.imageSmoothingEnabled = false;
      context.filter = `brightness(${1.08 + pulse * 0.05}) saturate(0.9)`;
      context.drawImage(
        youngerChildImage,
        youngerChildFrame * CARRIED_YOUNGER_CHILD_SPRITE.frameW,
        youngerChildRow * CARRIED_YOUNGER_CHILD_SPRITE.frameH,
        CARRIED_YOUNGER_CHILD_SPRITE.frameW,
        CARRIED_YOUNGER_CHILD_SPRITE.frameH,
        youngerChildX - youngerChildWidth * 0.5,
        youngerChildY,
        youngerChildWidth,
        youngerChildHeight,
      );
      context.filter = "none";
    }

    context.fillStyle = "rgba(238, 223, 234, 0.9)";
    context.beginPath();
    context.roundRect(centerX - size.width * 0.43, bundleY - size.height * 0.01, size.width * 0.86, size.height * 0.13, 12);
    context.fill();

    context.fillStyle = "rgba(196, 162, 186, 0.84)";
    context.beginPath();
    context.roundRect(centerX - size.width * 0.4, bundleY + size.height * 0.01, size.width * 0.8, size.height * 0.09, 12);
    context.fill();

    context.strokeStyle = "rgba(255, 241, 214, 0.5)";
    context.lineWidth = 2;
    context.beginPath();
    context.moveTo(centerX - size.width * 0.31, bundleY + size.height * 0.025);
    context.lineTo(centerX + size.width * 0.29, bundleY + size.height * 0.025);
    context.stroke();

    context.fillStyle = "rgba(255, 244, 214, 0.9)";
    context.beginPath();
    context.arc(youngerChildX - size.width * 0.012, youngerChildY + size.height * 0.1, size.width * 0.008, 0, Math.PI * 2);
    context.arc(youngerChildX + size.width * 0.012, youngerChildY + size.height * 0.1, size.width * 0.008, 0, Math.PI * 2);
    context.fill();

    context.strokeStyle = "rgba(90, 66, 74, 0.45)";
    context.lineWidth = 1.2;
    context.beginPath();
    context.arc(youngerChildX, youngerChildY + size.height * 0.12, size.width * 0.02, 0.15 * Math.PI, 0.85 * Math.PI);
    context.stroke();

    context.fillStyle = "rgba(255, 236, 200, 0.22)";
    context.beginPath();
    context.ellipse(olderChildX, olderChildY + olderChildHeight * 0.58, olderChildWidth * 0.52, olderChildHeight * 0.18, 0, 0, Math.PI * 2);
    context.ellipse(youngerChildX, youngerChildY + youngerChildHeight * 0.58, youngerChildWidth * 0.48, youngerChildHeight * 0.22, 0, 0, Math.PI * 2);
    context.fill();

    context.restore();
  }

  function drawPlayer(
    context,
    spriteImage,
    sprite,
    animationColumns,
    direction,
    frame,
    position,
    options = {},
  ) {
    drawCharacter(
      context,
      spriteImage,
      sprite,
      animationColumns,
      direction,
      frame,
      position,
    );

    if (options.carryChildren) {
      const size = getSpriteSize(sprite);
      drawCarriedChildren(context, position, size, direction);
    }

    if (options.showCandle) {
      const size = getSpriteSize(sprite);
      drawCarriedCandle(context, position, size, direction, options.candleStrength);
    }
  }

  function drawCharacter(
    context,
    spriteImage,
    sprite,
    animationColumns,
    direction,
    frame,
    position,
  ) {
    if (!spriteImage) {
      return;
    }

    const source = getFrameSource(sprite, animationColumns, direction, frame);
    const size = getSpriteSize(sprite);

    context.imageSmoothingEnabled = false;
    context.drawImage(
      spriteImage,
      source.sx,
      source.sy,
      source.sw,
      source.sh,
      position.x,
      position.y,
      size.width,
      size.height,
    );
  }

  window.PlayerRenderer = {
    drawInteractables,
    drawCharacter,
    drawPlayer,
    drawRoom,
    getSpriteSize,
  };
})();
