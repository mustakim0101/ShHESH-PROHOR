(function () {
  window.RoomRegistry.registerRoom({
    id: "basement",
    name: "Basement",
    background: "assets/images/backgrounds/basementTiles.jpg",
    gates: [
      {
        side: "top",
        targetRoomId: "living-room",
        range: { start: 0.3, end: 0.7 },
        spawn: { x: 0.46, y: 0.78 },
      },
    ],
  });
})();
