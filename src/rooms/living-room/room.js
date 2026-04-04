(function () {
  window.RoomRegistry.registerRoom({
    id: "living-room",
    name: "Living Room",
    background: "assets/images/backgrounds/middlefloor.png",
    gates: [
      {
        side: "left",
        targetRoomId: "kitchen",
        range: { start: 0.4, end: 0.82 },
        spawn: { x: 0.82, y: 0.62 },
      },
      {
        side: "right",
        targetRoomId: "children-room",
        range: { start: 0.4, end: 0.82 },
        spawn: { x: 0.06, y: 0.62 },
      },
      {
        side: "bottom",
        targetRoomId: "basement",
        range: { start: 0.3, end: 0.7 },
        spawn: { x: 0.46, y: 0.08 },
      },
    ],
  });
})();
