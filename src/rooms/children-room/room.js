(function () {
  window.RoomRegistry.registerRoom({
    id: "children-room",
    name: "Children's Room",
    background: "assets/images/backgrounds/topFloor.jpg",
    interactables: [
      { id: "youngerChild", label: "Younger Child", x: 0.28, y: 0.62, radius: 0.08 },
      { id: "olderChild", label: "Older Child", x: 0.68, y: 0.54, radius: 0.08 },
      { id: "familyDrawing", label: "Family Drawing", x: 0.52, y: 0.24, radius: 0.06 },
    ],
    gates: [
      {
        side: "left",
        targetRoomId: "living-room",
        range: { start: 0.28, end: 0.8 },
        spawn: { x: 0.84, y: 0.62 },
      },
    ],
  });
})();
