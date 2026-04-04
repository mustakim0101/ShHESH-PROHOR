(function () {
  window.RoomRegistry.registerRoom({
    id: "living-room",
    name: "Living Room",
    background: "assets/images/backgrounds/middlefloor.png",
    interactables: [
      { id: "tv", label: "TV", x: 0.62, y: 0.48, radius: 0.08 },
      { id: "frontDoor", label: "Front Door", x: 0.9, y: 0.48, radius: 0.06 },
      { id: "toyRobot", label: "Toy Robot", x: 0.5, y: 0.78, radius: 0.06 },
    ],
    gates: [
      {
        side: "left",
        targetRoomId: "kitchen",
        range: { start: 0.34, end: 0.88 },
        spawn: { x: 0.84, y: 0.62 },
      },
      {
        side: "right",
        targetRoomId: "children-room",
        range: { start: 0.28, end: 0.8 },
        spawn: { x: 0.08, y: 0.62 },
      },
      {
        side: "bottom",
        targetRoomId: "basement",
        range: { start: 0.34, end: 0.68 },
        spawn: { x: 0.5, y: 0.08 },
      },
    ],
  });
})();
