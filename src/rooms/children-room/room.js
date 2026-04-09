(function () {
  window.RoomRegistry.registerRoom({
    id: "children-room",
    name: "Children's Room",
    background: "assets/images/backgrounds/topFloor.jpg",
    walkableZones: [
      // Main room floor, kept inside the visible lower floorboards.
      {
        x: { start: 0.2, end: 0.82 },
        y: { start: 0.52, end: 0.87 },
      },
      // Left stair strip down to the living room.
      {
        x: { start: 0.14, end: 0.22 },
        y: { start: 0.58, end: 0.84 },
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
      // Lower-left outer void around the stair cutout.
      {
        x: { start: 0.02, end: 0.19 },
        y: { start: 0.84, end: 0.99 },
      },
      // Lower-right void outside the visible bedroom floor.
      {
        x: { start: 0.82, end: 0.98 },
        y: { start: 0.68, end: 0.99 },
      },
      // Bottom border below the visible floorboards.
      {
        x: { start: 0.19, end: 0.82 },
        y: { start: 0.88, end: 0.99 },
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
