(function () {
  window.RoomRegistry.registerRoom({
    id: "living-room",
    name: "Living Room",
    background: "assets/images/backgrounds/middlefloor.png",
    walkableZones: [
      // Main center floor.
      {
        x: { start: 0.08, end: 0.79 },
        y: { start: 0.5, end: 0.95 },
      },
      // Left stair path up to the children's room.
      {
        x: { start: 0.05, end: 0.17 },
        y: { start: 0.23, end: 0.75 },
      },
      // Upper-right floor edge in front of the window band.
      {
        x: { start: 0.22, end: 0.97 },
        y: { start: 0.39, end: 0.56 },
      },
      // Basement stair lane.
      {
        x: { start: 0.78, end: 0.97 },
        y: { start: 0.5, end: 0.75 },
      },
      // Lower stair mouth where the player steps onto the visible final stairs.
      {
        x: { start: 0.80, end: 0.98 },
        y: { start: 0.75, end: 0.85 },
      },
    ],
    blockedZones: [],
    interactables: [
      { id: "tv", label: "TV", x: 0.62, y: 0.48, radius: 0.08 },
      { id: "frontDoor", label: "Front Door", x: 0.9, y: 0.41, radius: 0.07 },
      { id: "toyRobot", label: "Toy Robot", x: 0.5, y: 0.78, radius: 0.06 },
    ],
    gates: [
      {
        side: "left",
        label: "enter Kitchen",
        targetRoomId: "kitchen",
        range: { start: 0.5, end: 0.95 },
        spawn: { x: 0.8, y: 0.66 },
      },
      {
        area: {
          x: { start: 0.03, end: 0.22 },
          y: { start: 0.16, end: 0.54 },
        },
        label: "go upstairs",
        targetRoomId: "children-room",
        spawn: { x: 0.08, y: 0.78 },
      },
      {
        area: {
          x: { start: 0.82, end: 0.98 },
          y: { start: 0.62, end: 0.9 },
        },
        label: "enter Basement",
        targetRoomId: "basement",
        spawn: { x: 0.94, y: 0.37 },
      },
    ],
  });
})();
