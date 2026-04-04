// Audio manifest and light helper utilities for teammate C.
// This manifest only includes sounds that currently exist in the repo
// and fit the game's restrained, domestic nighttime mood.

const AUDIO_MANIFEST = {
  ambience: {
    rainLight: {
      id: "rainLight",
      path: "assets/audio/ambience/rain_indoors_2.wav",
      loop: true,
      volume: 0.45,
    },
    rainHeavy: {
      id: "rainHeavy",
      path: "assets/audio/ambience/Dark_Rainy_Night(ambience).ogg",
      loop: true,
      volume: 0.55,
    },
    distantRumble: {
      id: "distantRumble",
      path: "assets/audio/ambience/thunder_3_far.wav",
      loop: false,
      volume: 0.35,
    },
    roomTone: {
      id: "roomTone",
      path: "assets/audio/ambience/wind_1.wav",
      loop: true,
      volume: 0.25,
    },
  },
  sfx: {
    clockTick: {
      id: "clockTick",
      path: "assets/audio/ambience/clock-tick.ogg",
      volume: 0.4,
    },
    radioStatic: {
      id: "radioStatic",
      path: "assets/audio/ambience/radio-static.ogg",
      volume: 0.45,
    },
    footstep: {
      id: "footstep",
      path: "assets/audio/ambience/0.ogg",
      loop: false,
      volume: 0.35,
    },
    drawerOpen: {
      id: "drawerOpen",
      path: "assets/audio/ambience/wood01.ogg",
      volume: 0.4,
    },
    robotJingle: {
      id: "robotJingle",
      path: "assets/audio/ambience/robot.mp3",
      volume: 0.5,
    },
    catPurr: {
      id: "catPurr",
      path: "assets/audio/ambience/cat_purrsleepy_loop.wav",
      volume: 0.4,
    },
  },
  voice: {
    biryaniShow: {
      id: "biryaniShow",
      path: "assets/audio/ambience/biryani-show.mp3",
      volume: 0.55,
    },
    cutOffVoiceNote: {
      id: "cutOffVoiceNote",
      path: "assets/audio/ambience/voice-note-cutoff.mp3",
      volume: 0.7,
    },
  },
  music: {
    tensionLoop: {
      id: "tensionLoop",
      path: "assets/audio/ambience/Zander Noriega - Perpetual Tension.mp3",
      loop: true,
      volume: 0.4,
    },
  },
};

function getAudioEntry(groupId, soundId) {
  return AUDIO_MANIFEST[groupId]?.[soundId] || null;
}

function listAudioGroups() {
  return Object.keys(AUDIO_MANIFEST);
}

function flattenAudioManifest() {
  return Object.values(AUDIO_MANIFEST).flatMap((group) => Object.values(group));
}

export { AUDIO_MANIFEST, getAudioEntry, listAudioGroups, flattenAudioManifest };
export default AUDIO_MANIFEST;
