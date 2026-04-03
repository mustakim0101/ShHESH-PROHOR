# ShHESH-PROHOR
A short top-down 2D browser game built for a game jam. Players protect a family through one tense night inside a small home, making careful decisions based on uncertain hints from TV, radio, phone, and distant sounds.

The game follows an ordinary family spending one tense night inside their home during an unnamed conflict. The player must observe sounds, check TV/radio/phone for hints, decide when to move family members, and try to keep everyone safe until morning.

The game focuses on atmosphere, uncertainty, care, and emotional storytelling rather than combat or spectacle.

---

## Game Summary

- **Genre:** 2D Top-Down Narrative Tension Game
- **Platform:** Web Browser
- **Engine / Framework:** HTML, CSS, JavaScript, Phaser 3
- **Perspective:** Top-down pixel art
- **Theme Direction:** Beauty in ordinary moments, family, waiting, fear, and hope
- **Goal:** Keep the family safe until dawn

---

## Core Gameplay Loop

1. Observe the environment
2. Check hints from TV, radio, phone, and outside sounds
3. Interpret the situation
4. Make a decision
5. Face the consequence
6. Survive until morning

---

## Planned Features

- One playable character
- Top-down movement
- Indoor room-based gameplay
- Apartment, hallway, and basement areas
- Character interaction system
- TV / radio / phone hint system
- Light on / off mechanic
- Tension-based event progression
- Multiple end states based on player choices
- Atmospheric sound design
- Pixel art sprite animation

---

## Art Direction

The game uses a retro-style top-down pixel art approach inspired by classic handheld-era RPG presentation.

Planned visual elements include:
- Character sprite sheets for movement in four directions
- Indoor tile-based room design
- Minimal UI
- Dark overlay and glow system for light switching
- Focus on mood rather than visual complexity

---

## Audio Direction

Sound is a major part of the experience.

Planned sound elements include:
- Night ambience
- Distant aircraft rumble
- Radio static
- TV click / broadcast noise
- Phone buzz
- Footsteps
- Door movement
- Tension loop / ambient background sound

---

## Project Structure

```text
shesh-prohor/
  index.html
  style.css
  README.md
  src/
    main.js
    scenes/
      BootScene.js
      TitleScene.js
      GameScene.js
      EndScene.js
    systems/
      GameState.js
      HintSystem.js
      AudioSystem.js
    data/
      events.js
      dialogue.js
  assets/
    images/
      characters/
      tilesets/
      ui/
      backgrounds/
    audio/
      ambience/
      sfx/
  maps/
