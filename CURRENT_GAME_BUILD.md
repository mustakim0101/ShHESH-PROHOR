# Current Game Build

This file describes the game as it exists right now in code.
It is a practical reference for the team.
It does not describe the full blueprint dream version. It describes the current playable build.

## Project State

The current build is a browser game with:
- one canvas-based playable scene system
- four explorable rooms
- movement and room switching
- interactable objects and characters
- a task queue
- a dialogue box with timed choices
- threat and battery systems
- a simple night timer
- basic audio playback
- basic visual mood states

The current live gameplay mainly covers:
- Event 01: The Contradiction
- Event 02: The Question
- Event 03: The Blackout
- Event 04: The Knock

Events 05 to 07 exist in `src/content/content.js` as written content, but they are not yet fully injected into the active playable game loop.

## Files That Drive The Current Build

Main playable page:
- `game.html`

Main runtime files:
- `src/main.js`
- `src/core/game.js`
- `src/core/gameState.js`
- `src/controllers/inputController.js`
- `src/controllers/movementController.js`
- `src/renderers/playerRenderer.js`
- `src/rooms/roomRegistry.js`
- `src/rooms/living-room/room.js`
- `src/rooms/kitchen/room.js`
- `src/rooms/children-room/room.js`
- `src/rooms/basement/room.js`
- `src/audio/audio.js`
- `style.css`

Content reference file:
- `src/content/content.js`

Help page:
- `controls.html`

## Step-Wise Implementation Status

### Step 3: Base Skeleton

Implemented now:
- HTML shell exists in `game.html`
- CSS is loaded
- JS files are loaded in order
- main game state object exists in `src/core/gameState.js`
- keyboard movement works
- the player can move between living room, kitchen, children's room, and basement
- room switching works through gate areas plus the `E` key

Current room layout in code:
- living room -> kitchen
- living room -> children's room
- living room -> basement
- kitchen -> living room
- children's room -> living room
- basement -> living room

This means the apartment currently works as a hub layout through the living room.

### Step 4: Text Content

Prepared in `src/content/content.js`:
- rooms
- interactables
- events 01 to 07
- dialogue
- endings
- ui text
- separate pitch notes and GDD notes

Important note:
- this content file is a content source/reference right now
- the active playable game does not yet read all of it directly
- `src/core/game.js` currently contains a smaller live gameplay copy for the first implemented events

### Step 5: Art and Audio Prep

Implemented now:
- room background images are assigned per room
- sprite rendering is working
- audio manager exists in `src/audio/audio.js`
- threat-based body classes exist in `style.css`
- blackout, candle, flicker, and ending visual classes exist in `style.css`
- currently available audio files are matched to the manifest

### Step 6: Core Gameplay Systems

Implemented now:
- threat meter
- battery system
- timed dialogue choices
- dialogue box
- task queue
- item interaction
- room-based triggers
- night timer
- blackout state
- candle recovery step

Not fully implemented yet:
- full phone system from the full design
- fully injected Events 05 to 07
- all final endings in the live loop
- all written content wired into the active runtime

## Controls

### Main Controls

Movement:
- `W A S D`
- `Arrow keys`

Interact with nearby object or person:
- `Space`

Use a gate / go to another room:
- `E`

Dialogue choice navigation:
- `Arrow Up`
- `Arrow Down`
- `Enter`

Direct choice selection:
- `1`
- `2`
- `3`

Sprint:
- `Shift`

### Control Rules

- `Space` only interacts with the nearest object or person.
- `E` only changes rooms when the player is standing in a gate area.
- When a dialogue box is open, movement stops until the dialogue is resolved.
- Timed dialogue choices auto-resolve when the timer expires.
- If a dialogue timer expires, the game chooses the last option in the list.

## HUD And On-Screen Systems

The HUD currently shows:
- current room name
- threat value
- battery percentage
- night timer
- task queue
- interaction hint line
- phone status line

The dialogue box currently shows:
- event title
- event body text
- choice list
- active countdown while a timed choice is open

## Current Core Systems

### 1. Threat System

Threat starts at `1`.
Threat is clamped between `1` and `5`.
Threat can increase or decrease based on choices.

Current threat effects:
- updates the HUD
- changes body classes from `threat-1` to `threat-5`
- updates audio manager threat level

Current choice impacts:
- Event 01:
  - trust TV -> threat becomes at least `2`
  - trust radio -> code adds `0.5`, but from the starting threat it effectively becomes `1 -> 2`
  - trust phone -> threat increases by `1` and battery drops by `2`
- Event 02:
  - reassure -> threat `+0.5`
  - deflect -> threat `+1`
  - stay silent -> threat `+1.5`
- Event 04:
  - stay quiet -> no extra threat change
  - speak through door -> threat `+1`
  - move away -> threat `-0.5` minimum floor `1`

### 2. Battery System

Battery starts at `18%`.
Battery is clamped between `0` and `100`.

Current battery rules:
- battery drops during blackout if the candle is not yet lit
- drain rate is `0.8` per second during active blackout before candle lighting
- choosing `trustPhone` in Event 01 reduces battery by `2`

Current battery usage in gameplay:
- it is displayed in the HUD
- it adds pressure during Event 03
- it does not yet power a full separate phone UI system

### 3. Night Timer

Night remaining starts at `15 minutes`.
The HUD shows it as `MM:SS`.
It counts down continuously during play.

Current use:
- visual pressure and pacing
- no final dawn resolution is fully wired yet

### 4. Dialogue System

The dialogue system is currently handled inside `src/core/game.js`.

Features already working:
- open dialogue box
- display title/body/choices
- move selection with up/down
- choose with Enter or number keys
- timed decisions
- automatic fallback choice on timer expiry

Current dialogue events injected into live play:
- Event 01
- Event 02
- Event 04

### 5. Task Queue System

Each active event sets a task list.
Tasks can be marked complete when the player reaches rooms or interacts with correct objects.

Current task behavior:
- tasks are shown on screen
- completed tasks are visually marked
- Event 01 dialogue only opens after all three source-check tasks are complete

### 6. Item Interaction System

Current interactables in live use:
- TV
- Radio
- Phone
- Younger Child
- Older Child
- Third Drawer
- Front Door
- Toy Robot

Current interaction rules:
- player must stand near the interactable
- the active item gets a visible highlight ring
- the item label appears at the top of the canvas
- pressing `Space` runs the interaction logic

### 7. Room Trigger System

Room-based logic currently used:
- going to the children's room after Event 01 triggers Event 02
- reaching the kitchen during Event 03 completes the `reachKitchen` task

## Current Room Map

### Living Room

Current contents:
- TV
- Front Door
- Toy Robot

Current exits:
- left side -> Kitchen
- upper-left stairs area -> Children's Room
- right-side stair area -> Basement

### Kitchen

Current contents:
- Radio
- Second Drawer
- Third Drawer
- Phone

Current exits:
- right side -> Living Room

Important current rule:
- only the Third Drawer is used in the blackout/candle event logic

### Children's Room

Current contents:
- Younger Child
- Older Child
- Family Drawing

Current exits:
- lower-left/downstairs area -> Living Room

### Basement

Current contents:
- Basement Stairs
- Safe Corner
- Outside Door

Current exits:
- upper-right/upstairs area -> Living Room

Note:
- basement interactables exist visually, but most of their deeper event logic is not yet active in the main gameplay loop

## Current Event Flow In The Playable Build

### Event 01: The Contradiction

Start state:
- this is the first active event
- task list asks the player to check TV, radio, and phone

Player actions needed:
- interact with TV
- interact with radio
- interact with phone

After all three are done:
- the Event 01 dialogue opens
- player chooses TV, radio, or phone

Current result:
- the game records the choice
- threat changes based on the choice
- phone choice also lowers battery slightly
- Event 02 becomes unlocked
- hint tells the player to go to the children's room

Important current truth rule:
- the game does not yet contain a hidden factual answer for which source is truly correct
- right now the choice works as a mechanical risk choice, not as a solved truth puzzle

### Event 02: The Question

Trigger:
- player enters the children's room after Event 01 is resolved

Player actions needed:
- go to Younger Child
- press `Space`
- choose a response

Current result:
- threat changes based on response tone
- Event 03 starts immediately after the answer

### Event 03: The Blackout

Trigger:
- after Event 02 resolves

What happens:
- blackout state becomes active
- battery begins to drain while the candle is still unlit
- task queue updates to kitchen/candle tasks
- thunder sound can play through audio manager

Player actions needed:
- go to kitchen
- interact with Third Drawer
- first interaction gives the candle
- second interaction lights the candle

Current result:
- blackout pressure stops once candle is lit
- Event 03 is marked complete
- Event 04 starts

### Event 04: The Knock

Trigger:
- immediately after the candle is lit

Player actions needed:
- go to Front Door
- check Older Child
- choose whether to stay quiet, speak, or move away

Current result:
- the game records the choice
- threat changes based on the choice
- interaction hint updates

Current limit:
- Event 04 does not yet lead into a fully wired Event 05 in the runtime loop

## Audio System

Audio manager file:
- `src/audio/audio.js`

Current audio categories:
- music
- ambience
- sfx
- voice

Current behavior:
- audio unlocks after first key press or pointer input
- room ambience changes by room
- footsteps play while moving with a cooldown
- clock ticks loop through repeated timed playback
- wind plays occasionally outside basement
- some object interactions trigger sounds
- Event 03 can trigger thunder

Current room ambience rules:
- basement -> `basementRain`
- kitchen and children's room -> `nightRooms`
- living room -> no continuous room ambience loop currently

Current interactable sound hooks:
- radio -> radio static
- phone -> cut-off voice note
- cat -> cat purr
- drawers / basement stairs -> drawer open sound
- toy robot -> robot sound

## Visual System

Visual control is mainly in `style.css` plus body classes set in `src/core/game.js`.

Current visual states:
- `threat-1` to `threat-5`
- `blackout`
- `candle-on`
- `tv-flicker`
- ending classes prepared in CSS

Current visual behavior in live build:
- threat classes update when threat changes
- blackout class turns on during Event 03
- candle class turns on after candle lighting
- tv flicker class is active during Event 01 and Event 04

## Movement And Collision Rules

Movement is handled by `src/controllers/movementController.js`.

Current movement rules:
- movement is normalized diagonally
- player direction changes based on movement vector
- walking and sprinting have different speeds and animation rates
- player movement is clamped inside canvas bounds
- movement is limited by room walkable zones and blocked zones
- room switches do not happen automatically on touch; player must press `E`

Spawn rules:
- when changing rooms, the game places the player at a target spawn point
- if the exact spawn point is blocked, the game searches nearby for the nearest walkable position

Debug rule:
- collision debug overlay can be enabled in browser console with:
- `window.SheshProhorDebug.showCollisionOverlay = true`

## What The Build Does Not Fully Have Yet

The current playable build does not fully have:
- full runtime use of all text written in `src/content/content.js`
- fully injected Event 05
- fully injected Event 06
- fully injected Event 07
- final ending resolution flow
- separate phone UI screen
- richer item/inventory systems beyond current flags
- basement rescue logic for older child in active runtime
- full blueprint logic across all late-game systems

## Practical Trust Guide For Team

If teammates need to know which file to trust for what:
- trust `src/core/game.js` for current live gameplay behavior
- trust `src/core/gameState.js` for current runtime state structure
- trust room files in `src/rooms/` for current room map and interactable placement
- trust `src/content/content.js` for planned story/content reference
- trust `controls.html` for player-facing controls text
- trust this file for a plain-English summary of the current build

## Short Summary

Right now the game is a playable early-night vertical slice.
The player can move through four rooms, interact with key objects, make timed decisions, manage rising pressure, survive a blackout by getting the candle, and respond to the knock.
The rest of the written story exists mainly as prepared content, not yet fully injected into the live gameplay loop.
