(function () {
  const AUDIO_MANIFEST = {
    music: {
      menuTheme: {
        id: "menuTheme",
        path: "assets/audio/ambience/Zander Noriega - Perpetual Tension.mp3",
        loop: true,
        volume: 0.4,
      },
    },
    ambience: {
      nightRooms: {
        id: "nightRooms",
        path: "assets/audio/ambience/Dark_Rainy_Night(ambience).ogg",
        loop: true,
        volume: 0.48,
      },
      basementRain: {
        id: "basementRain",
        path: "assets/audio/ambience/rain_indoors_2.wav",
        loop: true,
        volume: 0.5,
      },
    },
    sfx: {
      clockTick: {
        id: "clockTick",
        path: "assets/audio/ambience/clock-tick.ogg",
        volume: 0.35,
      },
      radioStatic: {
        id: "radioStatic",
        path: "assets/audio/ambience/radio-static.ogg",
        volume: 0.45,
      },
      footstep: {
        id: "footstep",
        path: "assets/audio/ambience/0.ogg",
        volume: 0.28,
      },
      drawerOpen: {
        id: "drawerOpen",
        path: "assets/audio/ambience/wood01.ogg",
        volume: 0.42,
      },
      robotJingle: {
        id: "robotJingle",
        path: "assets/audio/ambience/robot.mp3",
        volume: 0.45,
      },
      thunder: {
        id: "thunder",
        path: "assets/audio/ambience/thunder_3_far.wav",
        volume: 0.34,
      },
      wind: {
        id: "wind",
        path: "assets/audio/ambience/wind_1.wav",
        volume: 0.25,
      },
    },
    voice: {
      biryaniShow: {
        id: "biryaniShow",
        path: "assets/audio/ambience/biryani-show.mp3",
        volume: 0.52,
      },
      catPurr: {
        id: "catPurr",
        path: "assets/audio/ambience/cat_purrsleepy_loop.wav",
        volume: 0.42,
      },
      cutOffVoiceNote: {
        id: "cutOffVoiceNote",
        path: "assets/audio/ambience/voice-note-cutoff.mp3",
        volume: 0.68,
      },
    },
  };

  function createAudioElement(config) {
    const audio = new Audio(config.path);
    audio.preload = "auto";
    audio.loop = Boolean(config.loop);
    audio.volume = config.volume ?? 1;
    return audio;
  }

  function flattenManifest() {
    return Object.values(AUDIO_MANIFEST).flatMap((group) => Object.values(group));
  }

  const manager = {
    manifest: AUDIO_MANIFEST,
    clips: {},
    unlocked: false,
    currentRoomId: "living-room",
    currentThreatLevel: 1,
    currentAmbienceId: null,
    currentMusicId: null,
    footstepCooldown: 0,
    isMoving: false,
    clockTickCooldown: 0,
    windCooldown: 0,

    init() {
      if (!Object.keys(this.clips).length) {
        flattenManifest().forEach((entry) => {
          this.clips[entry.id] = createAudioElement(entry);
        });
      }

      const unlockAudio = () => {
        this.unlocked = true;
        if (this.currentMusicId) {
          this.playLoop(this.currentMusicId);
        }
        this.applyRoomAmbience();
        window.removeEventListener("keydown", unlockAudio);
        window.removeEventListener("pointerdown", unlockAudio);
      };

      window.addEventListener("keydown", unlockAudio, { once: true });
      window.addEventListener("pointerdown", unlockAudio, { once: true });
    },

    getClip(id) {
      return this.clips[id] || null;
    },

    play(id, { restart = true } = {}) {
      if (!this.unlocked) {
        return;
      }

      const clip = this.getClip(id);
      if (!clip) {
        return;
      }

      if (restart) {
        clip.currentTime = 0;
      }

      clip.play().catch(() => {});
    },

    playLoop(id) {
      if (!this.unlocked) {
        return;
      }

      const clip = this.getClip(id);
      if (!clip) {
        return;
      }

      clip.loop = true;
      if (!clip.paused) {
        return;
      }

      clip.currentTime = 0;
      clip.play().catch(() => {});
    },

    stop(id) {
      const clip = this.getClip(id);
      if (!clip) {
        return;
      }

      clip.pause();
      clip.currentTime = 0;
    },

    stopMany(ids) {
      ids.forEach((id) => this.stop(id));
    },

    playMusic(id) {
      if (this.currentMusicId && this.currentMusicId !== id) {
        this.stop(this.currentMusicId);
      }

      this.currentMusicId = id;
      if (!this.unlocked) {
        return;
      }

      this.playLoop(id);
    },

    stopMusic() {
      if (this.currentMusicId) {
        this.stop(this.currentMusicId);
      }
      this.currentMusicId = null;
    },

    setMenuActive(isActive) {
      if (isActive) {
        this.playMusic("menuTheme");
        this.stopMany(["nightRooms", "basementRain"]);
      } else {
        this.stopMusic();
        this.applyRoomAmbience();
      }
    },

    applyRoomAmbience() {
      const nextAmbienceId = this.currentRoomId === "basement" ? "basementRain"
        : (this.currentRoomId === "kitchen" || this.currentRoomId === "children-room" ? "nightRooms" : null);

      if (this.currentAmbienceId && this.currentAmbienceId !== nextAmbienceId) {
        this.stop(this.currentAmbienceId);
      }

      this.currentAmbienceId = nextAmbienceId;
      if (!this.unlocked) {
        return;
      }

      if (nextAmbienceId) {
        this.playLoop(nextAmbienceId);
      }
    },

    setThreatLevel(level) {
      this.currentThreatLevel = level;
    },

    setRoom(roomId) {
      this.currentRoomId = roomId;
      this.applyRoomAmbience();
    },

    setMovementActive(isMoving, dt) {
      this.isMoving = isMoving;
      this.footstepCooldown = Math.max(0, this.footstepCooldown - dt);

      if (!this.unlocked || !isMoving || this.footstepCooldown > 0) {
        return;
      }

      this.play("footstep");
      this.footstepCooldown = 0.34;
    },

    onInteractable(id) {
      if (!this.unlocked) {
        return;
      }

      if (id === "radio") {
        this.play("radioStatic");
      } else if (id === "phone") {
        this.play("cutOffVoiceNote");
      } else if (id === "cat") {
        this.play("catPurr");
      } else if (id === "kitchenDrawer2" || id === "kitchenDrawer3" || id === "basementStairs") {
        this.play("drawerOpen");
      } else if (id === "toyRobot") {
        this.play("robotJingle");
      }
    },

    onEvent(eventId) {
      if (!this.unlocked) {
        return;
      }

      if (eventId === "event03") {
        this.play("thunder");
      }
    },

    update(dt) {
      if (!this.unlocked) {
        return;
      }

      const tickInterval = Math.max(0.46, 1 - (Math.max(1, this.currentThreatLevel) - 1) * 0.08);
      this.clockTickCooldown = Math.max(0, this.clockTickCooldown - dt);
      if (this.clockTickCooldown === 0) {
        this.play("clockTick");
        this.clockTickCooldown = tickInterval;
      }

      this.windCooldown = Math.max(0, this.windCooldown - dt);
      if (this.windCooldown === 0 && this.currentRoomId !== "basement") {
        this.play("wind");
        this.windCooldown = 18 + Math.random() * 16;
      }
    },
  };

  window.AudioManager = manager;
})();
