(function () {
  window.RoomRegistry.registerRoom({
    id: "basement",
    name: "Basement",
    background: "assets/images/backgrounds/basementTiles.jpg",
    interactables: [
      { id: "basementStairs", label: "Basement Stairs", x: 0.5, y: 0.14, radius: 0.08 },
      { id: "safeCorner", label: "Safe Corner", x: 0.2, y: 0.8, radius: 0.08 },
      { id: "basementDoor", label: "Outside Door", x: 0.82, y: 0.58, radius: 0.08 },
    ],
    gates: [
      {
        side: "top",
        targetRoomId: "living-room",
        range: { start: 0.34, end: 0.68 },
        spawn: { x: 0.5, y: 0.76 },
      },
    ],
  });
})();
