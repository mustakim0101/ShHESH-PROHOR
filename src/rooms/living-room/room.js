(function () {
  window.RoomRegistry.registerRoom({
    id: "living-room",
    name: "Living Room",
    background: "assets/images/backgrounds/middlefloor.png",
    walkableZones: [
      {
        x: { start: 0.08, end: 0.79 },
        y: { start: 0.55, end: 0.95 },
      },
      {
        x: { start: 0.05, end: 0.17 },
        y: { start: 0.23, end: 0.75 },
      },
      {
        x: { start: 0.79, end: 0.95 },
        y: { start: 0.42, end: 0.6 },
      },
      {
        x: { start: 0.83, end: 0.95 },
        y: { start: 0.59, end: 0.78 },
      },
      {
        x: { start: 0.87, end: 0.97 },
        y: { start: 0.77, end: 0.95 },
      },
    ],
    blockedZones: [
      {
        x: { start: 0.17, end: 0.82 },
        y: { start: 0.11, end: 0.52 },
      },
    ],
    interactables: [
      { id: "tv", label: "TV", x: 0.62, y: 0.48, radius: 0.08 },
      { id: "frontDoor", label: "Front Door", x: 0.9, y: 0.41, radius: 0.07 },
      { id: "toyRobot", label: "Toy Robot", x: 0.5, y: 0.78, radius: 0.06 },
    ],
    gates: [
      {
        side: "left",
        targetRoomId: "kitchen",
        range: { start: 0.58, end: 0.92 },
        spawn: { x: 0.84, y: 0.62 },
      },
      {
        area: {
          x: { start: 0.06, end: 0.16 },
          y: { start: 0.22, end: 0.45 },
        },
        activation: { anyOfDirections: ["left", "up"] },
        targetRoomId: "children-room",
        spawn: { x: 0.13, y: 0.82 },
      },
      {
        area: {
          x: { start: 0.88, end: 0.97 },
          y: { start: 0.82, end: 0.95 },
        },
        activation: { anyOfDirections: ["right", "down"] },
        targetRoomId: "basement",
        spawn: { x: 0.9, y: 0.78 },
      },
    ],
  });
})();
