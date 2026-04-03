(function () {
  function getSpriteSize(sprite) {
    return {
      width: sprite.frameW * sprite.scale,
      height: sprite.frameH * sprite.scale,
    };
  }

  function applyPlayerStyle(player, sprite) {
    const spriteSize = getSpriteSize(sprite);
    player.style.width = `${spriteSize.width}px`;
    player.style.height = `${spriteSize.height}px`;
    player.style.backgroundImage = `url("${sprite.url}")`;
    player.style.backgroundSize = `${sprite.sheetW * sprite.scale}px ${sprite.sheetH * sprite.scale}px`;
  }

  function setPlayerFrame(player, sprite, animationColumns, direction, frame) {
    const maxCols = animationColumns[direction] || sprite.cols;
    const safeFrame = frame % maxCols;
    const x = safeFrame * sprite.frameW * sprite.scale;
    const row = Math.min(direction, sprite.rows - 1);
    const y = row * sprite.frameH * sprite.scale;
    player.style.backgroundPosition = `-${x}px -${y}px`;
  }

  function renderPlayerPosition(player, position) {
    player.style.left = `${position.x}px`;
    player.style.top = `${position.y}px`;
  }

  window.PlayerRenderer = {
    applyPlayerStyle,
    getSpriteSize,
    renderPlayerPosition,
    setPlayerFrame,
  };
})();
