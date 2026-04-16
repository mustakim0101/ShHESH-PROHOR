(function () {
  window.PlayerConfig = {
    sprite: {
      url: "assets/images/characters/maya.png",
      scale: 2,
      frameW: 64,
      frameH: 64,
      cols: 5,
      rows: 4,
      sheetW: 0,
      sheetH: 0,
    },
    childSprite: {
      url: "assets/images/characters/mom1.png",
      scale: 1.45,
      frameW: 64,
      frameH: 64,
      cols: 4,
      rows: 4,
      sheetW: 0,
      sheetH: 0,
    },
    olderChildSprite: {
      url: "assets/images/characters/oldersib.png",
      scale: 1.45,
      frameW: 64,
      frameH: 64,
      cols: 4,
      rows: 4,
      sheetW: 0,
      sheetH: 0,
    },
    animationColumns: [5, 4, 4, 4],
    childAnimationColumns: [4, 4, 4, 4],
    olderChildAnimationColumns: [4, 4, 4, 4],
    speed: {
      walk: 140,
      sprint: 220,
    },
    fps: {
      walk: 8,
      sprint: 12,
    },
    childFps: {
      walk: 7,
      sprint: 9,
    },
    olderChildFps: {
      walk: 7,
      sprint: 9,
    },
  };
})();
