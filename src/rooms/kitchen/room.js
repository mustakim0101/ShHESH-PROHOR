(function () {
  window.RoomRegistry.registerRoom({
    id: "kitchen",
    name: "Kitchen",
    background: "assets/images/backgrounds/someroom.jpg",
    walkableZones: [
      // Main wooden kitchen floor, trimmed off the outer black margins.
      {
        x: { start: 0.11, end: 0.86 },
        y: { start: 0.58, end: 0.88 },
      },
      // Thin front edge under the raised tile section so counters stay reachable from below.
      {
        x: { start: 0.21, end: 0.78 },
        y: { start: 0.52, end: 0.58 },
      },
      // Narrow right-side access where the phone sits, without spilling into the black edge.
      {
        x: { start: 0.75, end: 0.82 },
        y: { start: 0.55, end: 0.62 },
      },
      // Bottom doorway tiles where the player enters and exits.
      {
        x: { start: 0.42, end: 0.58 },
        y: { start: 0.82, end: 0.96 },
      },
    ],
    blockedZones: [
      // Upper-left black void outside the room walls.
      {
        x: { start: 0.0, end: 0.2 },
        y: { start: 0.0, end: 0.31 },
      },
      // Upper-right black void outside the room walls.
      {
        x: { start: 0.7, end: 1.0 },
        y: { start: 0.0, end: 0.31 },
      },
      // Top wall and void above the visible room floor.
      {
        x: { start: 0.06, end: 0.94 },
        y: { start: 0.04, end: 0.33 },
      },
      // Front railing edge of the raised counter section.
      {
        x: { start: 0.18, end: 0.8 },
        y: { start: 0.5, end: 0.56 },
      },
      // Carry the middle raised section upward so the player stays on the lower floor line.
      {
        x: { start: 0.23, end: 0.79 },
        y: { start: 0.33, end: 0.52 },
      },
      // Keep the left upper wall alcove non-walkable.
      {
        x: { start: 0.06, end: 0.22 },
        y: { start: 0.34, end: 0.56 },
      },
      // Lower the right-side blocked region a bit to match the marked boundary near the wall side.
      {
        x: { start: 0.79, end: 0.94 },
        y: { start: 0.34, end: 0.61 },
      },
      // Left wall strip so the player cannot slide into the black cutout.
      {
        x: { start: 0.0, end: 0.06 },
        y: { start: 0.31, end: 0.78 },
      },
      // Right wall strip so the player cannot slide into the black cutout.
      {
        x: { start: 0.94, end: 1.0 },
        y: { start: 0.31, end: 0.78 },
      },
      // Right outer void beside the room art.
      {
        x: { start: 0.86, end: 0.98 },
        y: { start: 0.52, end: 0.96 },
      },
      // Bottom corners outside the doorway stem.
      {
        x: { start: 0.02, end: 0.41 },
        y: { start: 0.88, end: 0.99 },
      },
      {
        x: { start: 0.59, end: 0.98 },
        y: { start: 0.88, end: 0.99 },
      },
    ],
    interactables: [
      { id: "radio", label: "Radio", x: 0.56, y: 0.4, radius: 0.08 },
      { id: "kitchenDrawer2", label: "Second Drawer", x: 0.44, y: 0.76, radius: 0.07 },
      { id: "kitchenDrawer3", label: "Third Drawer", x: 0.58, y: 0.76, radius: 0.07 },
      { id: "phone", label: "Phone", x: 0.78, y: 0.58, radius: 0.06 },
    ],
    gates: [
      {
        side: "right",
        label: "enter Living Room",
        targetRoomId: "living-room",
        range: { start: 0.28, end: 0.92 },
        spawn: { x: 0.16, y: 0.68 },
      },
    ],
  });
})();
