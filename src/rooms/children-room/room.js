(function () {
  window.RoomRegistry.registerRoom({
    id: "children-room",
    name: "Children's Room",
    background: "assets/images/backgrounds/topFloor.jpg",
    gates: [
      {
        side: "left",
        targetRoomId: "living-room",
        range: { start: 0.4, end: 0.82 },
        spawn: { x: 0.82, y: 0.62 },
      },
    ],
  });
})();
