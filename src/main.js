const room = document.getElementById("room");
const player = document.getElementById("player");

const sprite = {
  url: "assets/images/characters/maya.png",
  scale: 2,
  frameW: 64,
  frameH: 64,
  cols: 5,
  rows: 4,
  sheetW: 0,
  sheetH: 0,
};

const perDirCols = [5, 4, 4, 4]; // down, left, right, up

const keys = new Set();
let pos = { x: 0, y: 0 };
let lastTime = performance.now();
let animTime = 0;
let frame = 0;
let direction = 0; // 0 down, 1 left, 2 right, 3 up
let roomRect = null;

function updateRoomBounds() {
  roomRect = room.getBoundingClientRect();
  const spriteW = sprite.frameW * sprite.scale;
  const spriteH = sprite.frameH * sprite.scale;
  pos.x = Math.max(0, Math.min(pos.x, roomRect.width - spriteW));
  pos.y = Math.max(0, Math.min(pos.y, roomRect.height - spriteH));
}

function setPlayerStyle() {
  const spriteW = sprite.frameW * sprite.scale;
  const spriteH = sprite.frameH * sprite.scale;
  player.style.width = `${spriteW}px`;
  player.style.height = `${spriteH}px`;
  player.style.backgroundSize = `${sprite.sheetW * sprite.scale}px ${sprite.sheetH * sprite.scale}px`;
}

function setFrame() {
  const maxCols = perDirCols[direction] || sprite.cols;
  const safeFrame = frame % maxCols;
  const x = safeFrame * sprite.frameW * sprite.scale;
  const row = Math.min(direction, sprite.rows - 1);
  const y = row * sprite.frameH * sprite.scale;
  player.style.backgroundPosition = `-${x}px -${y}px`;
}

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

function updateDirection(dx, dy) {
  const prevDir = direction;
  if (Math.abs(dx) > Math.abs(dy)) {
    direction = dx > 0 ? 2 : 1;
  } else if (Math.abs(dy) > 0) {
    direction = dy > 0 ? 0 : 3;
  }
  if (direction !== prevDir) {
    frame = 0;
  }
}

function loop(now) {
  const dt = Math.min(0.05, (now - lastTime) / 1000);
  lastTime = now;

  let dx = 0;
  let dy = 0;
  for (const code of keys) {
    if (isDown(code)) dy += 1;
    if (isUp(code)) dy -= 1;
    if (isLeft(code)) dx -= 1;
    if (isRight(code)) dx += 1;
  }

  if (dx !== 0 || dy !== 0) {
    const len = Math.hypot(dx, dy) || 1;
    dx /= len;
    dy /= len;
    updateDirection(dx, dy);

    const sprint = keys.has("ShiftLeft") || keys.has("ShiftRight");
    const speed = sprint ? 220 : 140;
    pos.x += dx * speed * dt;
    pos.y += dy * speed * dt;

    const spriteW = sprite.frameW * sprite.scale;
    const spriteH = sprite.frameH * sprite.scale;
    pos.x = Math.max(0, Math.min(pos.x, roomRect.width - spriteW));
    pos.y = Math.max(0, Math.min(pos.y, roomRect.height - spriteH));

    animTime += dt;
    const fps = sprint ? 12 : 8;
    if (animTime >= 1 / fps) {
      const maxCols = perDirCols[direction] || sprite.cols;
      frame = (frame + 1) % maxCols;
      animTime = 0;
    }
  } else {
    frame = 0;
  }

  player.style.left = `${pos.x}px`;
  player.style.top = `${pos.y}px`;
  setFrame();
  requestAnimationFrame(loop);
}

function init() {
  const img = new Image();
  img.onload = () => {
    sprite.sheetW = img.width;
    sprite.sheetH = img.height;
    setPlayerStyle();
    updateRoomBounds();

    pos.x = roomRect.width * 0.5 - sprite.frameW * sprite.scale * 0.5;
    pos.y = roomRect.height * 0.65 - sprite.frameH * sprite.scale * 0.5;

    setFrame();
    requestAnimationFrame(loop);
  };
  img.onerror = () => {
    console.error("Failed to load sprite sheet:", sprite.url);
  };
  img.src = sprite.url;
}

window.addEventListener("resize", () => {
  updateRoomBounds();
});

window.addEventListener("keydown", (event) => {
  keys.add(event.code);
});

window.addEventListener("keyup", (event) => {
  keys.delete(event.code);
});

init();


