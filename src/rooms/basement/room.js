(function () {
  window.RoomRegistry.registerRoom({
    id: "basement",
    name: "Basement",
    background: "assets/images/backgrounds/basement.jpg",
    walkableZones: [
      // Main visible basement floor.
      {
        x: { start: 0.03, end: 0.82 },
        y: { start: 0.29, end: 0.98 },
      },
      // Right-side stair approach and landing.
      {
        x: { start: 0.79, end: 0.98 },
        y: { start: 0.44, end: 0.71 },
      },
      // Narrow upper stair lane for changing floors.
      {
        x: { start: 0.88, end: 0.99 },
        y: { start: 0.11, end: 0.4 },
      },
    ],
    blockedZones: [
      // Upper wall band below the windows and railing.
      {
        x: { start: 0.03, end: 0.8 },
        y: { start: 0.03, end: 0.29 },
      },
      // Left hanging machine.
      {
        x: { start: 0.08, end: 0.17 },
        y: { start: 0.31, end: 0.58 },
      },
      // Middle hanging machine.
      {
        x: { start: 0.21, end: 0.29 },
        y: { start: 0.31, end: 0.58 },
      },
      // Upper-right shelves and drawer stack.
      {
        x: { start: 0.62, end: 0.8 },
        y: { start: 0.3, end: 0.45 },
      },
      // Center-right crate stack.
      {
        x: { start: 0.61, end: 0.82 },
        y: { start: 0.58, end: 0.74 },
      },
      // Dark stair-side wall left of the climbable lane.
      {
        x: { start: 0.8, end: 0.88 },
        y: { start: 0.1, end: 0.43 },
      },
      // Bottom-right tiled corner outside the wood floor.
      {
        x: { start: 0.82, end: 0.99 },
        y: { start: 0.68, end: 0.99 },
      },
    ],
    interactables: [
      { id: "basementStairs", label: "Basement Stairs", x: 0.93, y: 0.27, radius: 0.08 },
      { id: "safeCorner", label: "Safe Corner", x: 0.2, y: 0.8, radius: 0.08 },
      { id: "basementDoor", label: "Drawer", x: 0.82, y: 0.58, radius: 0.08 },
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
