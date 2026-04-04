(function () {
  function createStoryIntro(options) {
    const root = options.root;
    const viewport = root ? root.querySelector("#story-viewport") : null;
    const copy = root ? root.querySelector("#story-copy") : null;
    const skipButton = root ? root.querySelector("#story-skip-button") : null;
    const backButton = root ? root.querySelector("#story-back-button") : null;
    const audio = window.AudioManager || null;
    let frameId = 0;
    let finishTimer = 0;
    let started = false;
    let resolved = false;

    function cleanup() {
      if (frameId) {
        cancelAnimationFrame(frameId);
        frameId = 0;
      }

      if (finishTimer) {
        clearTimeout(finishTimer);
        finishTimer = 0;
      }
    }

    function closeStory() {
      if (!root) {
        return;
      }

      root.classList.remove("is-active");
      root.setAttribute("hidden", "hidden");
      cleanup();
    }

    function startGame() {
      if (resolved) {
        return;
      }

      resolved = true;
      audio?.setStoryActive(false);
      closeStory();
      if (typeof options.onStartGame === "function") {
        options.onStartGame();
      }
    }

    function backToMenu() {
      if (resolved) {
        return;
      }

      resolved = true;
      cleanup();
      audio?.setStoryActive(false);
      if (typeof options.onBackToMenu === "function") {
        options.onBackToMenu();
      }
    }

    function updateCopyPosition(offsetY) {
      if (!copy) {
        return;
      }

      copy.style.transform = `translate(-50%, ${offsetY}px)`;
    }

    function beginScroll() {
      if (!viewport || !copy || started) {
        return;
      }

      started = true;

      const viewportHeight = viewport.clientHeight;
      const copyHeight = copy.scrollHeight;
      const startOffset = viewportHeight;
      const endOffset = -copyHeight - 24;
      const totalDistance = startOffset - endOffset;
      const pixelsPerSecond = 36;
      const duration = (totalDistance / pixelsPerSecond) * 1000;
      const startTime = performance.now() + 700;

      updateCopyPosition(startOffset);

      function step(now) {
        const elapsed = Math.max(0, now - startTime);
        const progress = Math.min(1, elapsed / duration);
        const offsetY = startOffset - totalDistance * progress;

        updateCopyPosition(offsetY);

        if (progress < 1) {
          frameId = requestAnimationFrame(step);
          return;
        }

        finishTimer = window.setTimeout(() => {
          startGame();
        }, 1400);
      }

      frameId = requestAnimationFrame(step);
    }

    function init() {
      if (!root || !viewport || !copy) {
        if (typeof options.onStartGame === "function") {
          options.onStartGame();
        }
        return;
      }

      skipButton?.addEventListener("click", startGame);
      backButton?.addEventListener("click", backToMenu);
      audio?.init();
      audio?.setStoryActive(true);
      beginScroll();
    }

    return {
      init,
    };
  }

  window.StoryIntro = {
    createStoryIntro,
  };
})();
