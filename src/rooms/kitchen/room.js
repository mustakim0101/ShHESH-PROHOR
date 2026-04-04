(function () {
  window.RoomRegistry.registerRoom({
    id: "kitchen",
    name: "Kitchen",
    background: "assets/images/backgrounds/someroom.jpg",
    gates: [
      {
        side: "right",
        targetRoomId: "living-room",
        range: { start: 0.4, end: 0.82 },
        spawn: { x: 0.18, y: 0.2 },
      },
    ],
  });
})();
