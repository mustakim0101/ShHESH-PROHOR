(function () {
  window.RoomRegistry.registerRoom({
    id: "kitchen",
    name: "Kitchen",
    background: "assets/images/backgrounds/someroom.jpg",
    walkableZones: [
      // Main wooden kitchen floor, trimmed off the outer black margins.
      {
        x: { start: 0.14, end: 0.82 },
        y: { start: 0.58, end: 0.86 },
      },
      // Thin front edge under the raised tile section so upper-center objects stay reachable from below.
      {
        x: { start: 0.25, end: 0.76 },
        y: { start: 0.5, end: 0.58 },
      },
      // Narrow right-side access where the phone sits, without spilling into the black edge.
      {
        x: { start: 0.72, end: 0.8 },
        y: { start: 0.57, end: 0.64 },
      },
      // Right-side exit lane to the living room.
      {
        x: { start: 0.7, end: 0.81 },
        y: { start: 0.65, end: 0.87 },
      },
      // Bottom doorway tiles where the player enters and exits.
      {
        x: { start: 0.44, end: 0.56 },
        y: { start: 0.82, end: 0.96 },
      },
    ],
    blockedZones: [
      // Upper-left black void outside the room walls.
      {
        x: { start: 0.0, end: 0.24 },
        y: { start: 0.0, end: 0.41 },
      },
      // Upper-right black void outside the room walls.
      {
        x: { start: 0.76, end: 1.0 },
        y: { start: 0.0, end: 0.42 },
      },
      // Top wall and black void above the visible room floor.
      {
        x: { start: 0.08, end: 0.92 },
        y: { start: 0.04, end: 0.36 },
      },
      // Front railing edge of the raised counter section.
      // Keep this shallow so it does not erase the narrow access lip under the radio.
      {
        x: { start: 0.22, end: 0.78 },
        y: { start: 0.5, end: 0.52 },
      },
      // Carry the middle raised section upward so the player stays on the lower floor line.
      // Stop a bit higher to preserve the reachable front lip.
      {
        x: { start: 0.25, end: 0.77 },
        y: { start: 0.33, end: 0.49 },
      },
      // Keep the left upper wall alcove non-walkable.
      {
        x: { start: 0.0, end: 0.26 },
        y: { start: 0.34, end: 0.61 },
      },
      // Lower the right-side blocked region a bit to cover the black side cutout.
      {
        x: { start: 0.82, end: 0.98 },
        y: { start: 0.33, end: 0.66 },
      },
      // Left wall strip so the player cannot slide into the black cutout.
      {
        x: { start: 0.0, end: 0.1 },
        y: { start: 0.31, end: 0.82 },
      },
      // Right wall strip so the player cannot slide into the black cutout.
      {
        x: { start: 0.9, end: 1.0 },
        y: { start: 0.31, end: 0.84 },
      },
      // Right outer void beside the room art.
      {
        x: { start: 0.86, end: 1.0 },
        y: { start: 0.46, end: 1.0 },
      },
      // Bottom-left and bottom-right black corners outside the doorway stem.
      {
        x: { start: 0.0, end: 0.43 },
        y: { start: 0.78, end: 1.0 },
      },
      {
        x: { start: 0.66, end: 1.0 },
        y: { start: 0.89, end: 1.0 },
      },
    ],
    interactables: [
      { id: "radio", label: "Radio", x: 0.56, y: 0.43, radius: 0.1 },
      { id: "kitchenDrawer2", label: "Second Drawer", x: 0.44, y: 0.76, radius: 0.07 },
      { id: "kitchenDrawer3", label: "Third Drawer", x: 0.58, y: 0.76, radius: 0.07 },
      { id: "phone", label: "Phone", x: 0.78, y: 0.58, radius: 0.06 },
      { id: "cat", label: "Cat", x: 0.34, y: 0.79, radius: 0.07 },
    ],
    gates: [
      {
        side: "right",
        range: { start: 0.56, end: 0.9 },
        threshold: 42,
        label: "enter Living Room",
        targetRoomId: "living-room",
        spawn: { x: 0.16, y: 0.68 },
      },
    ],
  });
})();
