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

    if (roomState.backgroundImage) {
      context.drawImage(roomState.backgroundImage, 0, 0, canvas.width, canvas.height);
    } else {
      context.fillStyle = "#14141f";
      context.fillRect(0, 0, canvas.width, canvas.height);
    }

    context.fillStyle = "rgba(0, 0, 0, 0.14)";
    context.fillRect(0, 0, canvas.width, canvas.height);
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
    drawPlayer,
    drawRoom,
    getSpriteSize,
  };
})();
