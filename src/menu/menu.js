(function () {
  const audio = window.AudioManager || null;

  if (!audio) {
    return;
  }

  audio.init();
  audio.setMenuActive(true);

  window.addEventListener("pagehide", () => {
    audio.stopMusic();
  });
})();
