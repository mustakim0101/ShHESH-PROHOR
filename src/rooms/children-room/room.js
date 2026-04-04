(function () {
  window.RoomRegistry.registerRoom({
    id: "children-room",
    name: "Children's Room",
    background: "assets/images/backgrounds/topFloor.jpg",
    walkableZones: [
      {
        x: { start: 0.18, end: 0.9 },
        y: { start: 0.5, end: 0.93 },
      },
      {
        x: { start: 0.07, end: 0.18 },
        y: { start: 0.58, end: 0.95 },
      },
    ],
    blockedZones: [
      {
        x: { start: 0.16, end: 0.91 },
        y: { start: 0.12, end: 0.47 },
      },
      {
        x: { start: 0.02, end: 0.16 },
        y: { start: 0.12, end: 0.56 },
      },
      {
        x: { start: 0.64, end: 0.8 },
        y: { start: 0.31, end: 0.72 },
      },
      {
        x: { start: 0.79, end: 0.96 },
        y: { start: 0.38, end: 0.86 },
      },
    ],
    interactables: [
      { id: "youngerChild", label: "Younger Child", x: 0.28, y: 0.62, radius: 0.08 },
      { id: "olderChild", label: "Older Child", x: 0.6, y: 0.61, radius: 0.08 },
      { id: "familyDrawing", label: "Family Drawing", x: 0.52, y: 0.24, radius: 0.06 },
    ],
    gates: [
      {
        area: {
          x: { start: 0.05, end: 0.2 },
          y: { start: 0.74, end: 0.97 },
        },
        label: "go downstairs",
        targetRoomId: "living-room",
        spawn: { x: 0.05, y: 0.46 },
      },
    ],
  });
})();
