(function () {
  window.RoomRegistry.registerRoom({
    id: "basement",
    name: "Basement",
    background: "assets/images/backgrounds/basement.jpg",
    walkableZones: [
      // Main basement floor.
      {
        x: { start: 0.05, end: 0.87 },
        y: { start: 0.48, end: 0.96 },
      },
      // Lower stair landing where the player steps off onto the floor.
      {
        x: { start: 0.82, end: 0.99 },
        y: { start: 0.44, end: 0.66 },
      },
      // Narrow upper stair lane running down from the staircase.
      {
        x: { start: 0.89, end: 0.99 },
        y: { start: 0.12, end: 0.46 },
      },
    ],
    blockedZones: [
      // Upper wall band under the windows.
      {
        x: { start: 0.04, end: 0.86 },
        y: { start: 0.04, end: 0.44 },
      },
      // Solid stair-side wall left of the upper stair lane.
      {
        x: { start: 0.83, end: 0.89 },
        y: { start: 0.12, end: 0.35 },
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
          x: { start: 0.84, end: 0.99 },
          y: { start: 0.1, end: 0.42 },
        },
        label: "go upstairs",
        targetRoomId: "living-room",
        spawn: { x: 0.89, y: 0.6 },
      },
    ],
  });
})();
