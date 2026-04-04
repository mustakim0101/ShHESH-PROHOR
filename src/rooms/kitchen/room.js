(function () {
  window.RoomRegistry.registerRoom({
    id: "kitchen",
    name: "Kitchen",
    background: "assets/images/backgrounds/someroom.jpg",
    walkableZones: [
      {
        x: { start: 0.07, end: 0.93 },
        y: { start: 0.42, end: 0.91 },
      },
      {
        x: { start: 0.26, end: 0.77 },
        y: { start: 0.28, end: 0.58 },
      },
      {
        x: { start: 0.43, end: 0.57 },
        y: { start: 0.76, end: 0.99 },
      },
    ],
    blockedZones: [
      {
        x: { start: 0.08, end: 0.92 },
        y: { start: 0.06, end: 0.26 },
      },
    ],
    interactables: [
      { id: "radio", label: "Radio", x: 0.56, y: 0.4, radius: 0.08 },
      { id: "kitchenDrawer2", label: "Second Drawer", x: 0.44, y: 0.76, radius: 0.07 },
      { id: "kitchenDrawer3", label: "Third Drawer", x: 0.58, y: 0.76, radius: 0.07 },
      { id: "phone", label: "Phone", x: 0.78, y: 0.34, radius: 0.06 },
    ],
    gates: [
      {
        side: "right",
        targetRoomId: "living-room",
        range: { start: 0.34, end: 0.88 },
        spawn: { x: 0.12, y: 0.62 },
      },
    ],
  });
})();
