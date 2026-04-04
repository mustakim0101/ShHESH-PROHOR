(function () {
  const rooms = {};

  function registerRoom(room) {
    rooms[room.id] = room;
  }

  function getRoom(roomId) {
    return rooms[roomId];
  }

  window.RoomRegistry = {
    getRoom,
    registerRoom,
  };
})();
