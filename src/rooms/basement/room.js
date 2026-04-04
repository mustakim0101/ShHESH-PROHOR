(function () {
  window.RoomRegistry.registerRoom({
    id: "basement",
    name: "Basement",
    background: "assets/images/backgrounds/basement.jpg",
    walkableZones: [
      {
        x: { start: 0.05, end: 0.88 },
        y: { start: 0.47, end: 0.96 },
      },
      {
        x: { start: 0.82, end: 0.9 },
        y: { start: 0.59, end: 0.89 },
      },
      {
        x: { start: 0.89, end: 0.99 },
        y: { start: 0.12, end: 0.9 },
      },
    ],
    blockedZones: [
      {
        x: { start: 0.04, end: 0.88 },
        y: { start: 0.04, end: 0.45 },
      },
      {
        x: { start: 0.8, end: 0.89 },
        y: { start: 0.47, end: 0.69 },
      },
    ],
    interactables: [
      { id: "basementStairs", label: "Basement Stairs", x: 0.93, y: 0.27, radius: 0.08 },
      { id: "safeCorner", label: "Safe Corner", x: 0.2, y: 0.8, radius: 0.08 },
      { id: "basementDoor", label: "Outside Door", x: 0.82, y: 0.58, radius: 0.08 },
    ],
    gates: [
      {
        area: {
          x: { start: 0.9, end: 0.99 },
          y: { start: 0.16, end: 0.34 },
        },
        activation: { anyOfDirections: ["right", "up"] },
        targetRoomId: "living-room",
        spawn: { x: 0.89, y: 0.84 },
      },
    ],
  });
})();
