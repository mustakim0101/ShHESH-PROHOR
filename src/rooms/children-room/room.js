(function () {
  window.RoomRegistry.registerRoom({
    id: "children-room",
    name: "Children's Room",
    background: "assets/images/backgrounds/topFloor.jpg",
    gates: [
      {
        area: {
          x: { start: 0.03, end: 0.28 },
          y: { start: 0.72, end: 0.97 },
        },
        targetRoomId: "living-room",
        spawn: { x: 0.18, y: 0.2 },
      },
    ],
  });
})();
