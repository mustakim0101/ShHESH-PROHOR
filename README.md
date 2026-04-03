# Shesh Prohor

Shesh Prohor (শেষ প্রহর) is a browser-based narrative survival thriller about a parent trying to keep a family safe through the last dark watch before dawn. The game takes place inside a small apartment where ordinary things like a wall clock, a candle, a cup of tea, a TV broadcast, and a child's question become the entire emotional weight of the night.

The project is built for a game jam around the idea of finding beauty in ordinary life. The apartment is the game world. The family is the stakes. The fear comes from distance, timing, uncertainty, and the pressure of making the wrong decision when every source of information says something different.

## Blueprint Direction

- Platform: Browser-based
- Tech: HTML5, CSS3, Vanilla JavaScript
- Audio/animation support: Howler.js via CDN and GSAP free tier via CDN
- Engine: No game engine
- Runtime target: 15 to 20 minutes per playthrough
- Input: Keyboard only
- Endings: 3 main endings and 1 secret biryani variant

## Core Premise

You play as a parent inside a small apartment late at night. Outside, there is a distant rumble, static on the radio, a TV that keeps cutting out, and messages arriving on a phone with low battery. Inside, two children need reassurance and protection. Through one long night, you move between rooms, gather information, make calls under pressure, and try to keep the family together until dawn.

## Core Mechanic

- Move physically through the apartment in real time
- Check different information sources like the TV, radio, and phone
- Respond to crisis events by running to the correct room and interacting with the right object or family member
- Manage threat through choices, timing, and preparation
- Discover hidden items that permanently change later outcomes

The blueprint defines the game as a continuous apartment space with four key areas:

- Living room
- Kitchen
- Children's room
- Basement

## Planned Systems

- Continuous room-to-room movement
- Room-based interactions with keyboard controls
- A main game state object for threat, items, family state, and event progress
- A threat system expressed through atmosphere instead of visible numbers
- Seven crisis events with physical tasks
- Hidden item discovery through exploration
- Family gathering and basement safety flow
- Multiple endings based on player decisions and preparation

## Controls

- Arrow Left / Right: Walk
- Arrow Up: Enter a room or descend stairs
- Arrow Down: Crouch and hide
- SPACE: Interact with objects or family members
- Arrow Up / Down + ENTER: Select dialogue choices

No mouse is required.

## Hidden Items From The Blueprint

- Phone charger behind the kitchen radio
- Candle in the kitchen drawer
- Basement key in the kitchen drawer
- Toy robot in the living room that is visible from the start and can create problems if ignored

## Main Files

Current collaboration now uses folder ownership so teammates can work in parallel with fewer merge conflicts.

- [index.html](d:/Project/GameJam/SHESH-PROHOR/index.html): HTML shell and script loading
- [style.css](d:/Project/GameJam/SHESH-PROHOR/style.css): visual styling and atmosphere
- [src/core/game.js](d:/Project/GameJam/SHESH-PROHOR/src/core/game.js): core game skeleton, state, movement, room flow
- [src/content/content.js](d:/Project/GameJam/SHESH-PROHOR/src/content/content.js): dialogue, events, hints, interactable content
- [src/audio/audio.js](d:/Project/GameJam/SHESH-PROHOR/src/audio/audio.js): audio hooks, ambience, music, SFX logic
- [src/main.js](d:/Project/GameJam/SHESH-PROHOR/src/main.js): current movement prototype/reference

Legacy root files remain untouched for safety during transition:

- [game.js](d:/Project/GameJam/SHESH-PROHOR/game.js)
- [content.js](d:/Project/GameJam/SHESH-PROHOR/content.js)
- [audio.js](d:/Project/GameJam/SHESH-PROHOR/audio.js)

## Team Split

- Teammate A: [src/core/README.md](d:/Project/GameJam/SHESH-PROHOR/src/core/README.md)
- Teammate B: [src/content/README.md](d:/Project/GameJam/SHESH-PROHOR/src/content/README.md)
- Teammate C: [src/audio/README.md](d:/Project/GameJam/SHESH-PROHOR/src/audio/README.md)

## Current Goal

The current build phase is focused on the foundation:

- set up the HTML shell
- load CSS and JavaScript files
- build the main game state layer
- connect keyboard movement to room switching
- support movement between the living room, kitchen, children's room, and basement

## Notes

- The project should work directly in a browser with relative paths
- Readable jam code is preferred over heavy tooling
- External assets, libraries, and AI assistance should be documented clearly in the final GDD/submission materials
