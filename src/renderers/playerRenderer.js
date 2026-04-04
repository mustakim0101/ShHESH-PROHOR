(function () {
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
  }

  function drawInteractables(context, canvas, interactables, activeItem) {
    if (!Array.isArray(interactables)) {
      return;
    }

    interactables.forEach((item) => {
      const x = canvas.width * item.x;
      const y = canvas.height * item.y;
      const radius = Math.max(10, Math.round(Math.min(canvas.width, canvas.height) * item.radius * 0.3));
      const isActive = activeItem && item.id === activeItem.id;

      context.save();
      context.strokeStyle = isActive ? "rgba(255, 196, 115, 0.95)" : "rgba(231, 231, 245, 0.45)";
      context.fillStyle = isActive ? "rgba(255, 196, 115, 0.18)" : "rgba(14, 14, 28, 0.12)";
      context.lineWidth = isActive ? 3 : 2;
      context.beginPath();
      context.arc(x, y, radius, 0, Math.PI * 2);
      context.fill();
      context.stroke();
      context.restore();
    });

    if (activeItem) {
      drawLabel(context, canvas, activeItem.label);
    }
  }

  function drawLabel(context, canvas, label) {
    context.save();
    context.font = '13px "JetBrains Mono", monospace';
    context.textAlign = "center";
    context.textBaseline = "middle";

    const textWidth = context.measureText(label).width;
    const boxWidth = textWidth + 28;
    const boxHeight = 30;
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

  function drawPlayer(context, spriteImage, sprite, animationColumns, direction, frame, position) {
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
    drawPlayer,
    drawRoom,
    getSpriteSize,
  };
})();
