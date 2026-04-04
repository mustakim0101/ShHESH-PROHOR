## 2026-04-04 basement + kitchen collision shape recut

Did one last room-specific collision pass for the basement and kitchen only, using more intentional floor/landing shapes instead of broad rectangles.

- `src/rooms/basement/room.js`
  - Reshaped the basement into three connected walkable pieces: main floor, lower stair landing, and narrow upper stair lane.
  - Restored a small upper wall band block plus a narrow stair-side wall block so the path follows the staircase shape instead of feeling randomly widened.
  - Kept the current gate and spawn values unchanged.

- `src/rooms/kitchen/room.js`
  - Recut the kitchen into the main lower floor, a thin front access strip under the raised section, and a slightly lower right-front strip.
  - Added back room-specific blocked zones for the top wall, the raised middle section, the left alcove, and the lowered right-side wall region.
  - Kept interactables reachable from the proper lower floor edge.

## 2026-04-04 living-room upper boundary correction

Made one final living-room-only walkable-zone correction to remove the remaining invisible wall along the upper floor boundary.

- `src/rooms/living-room/room.js`
  - Raised the main center floor upward so it reaches farther toward the intended upper movement limit.
  - Expanded the upper-right walkable strip farther left and slightly lower so it overlaps the main floor instead of leaving a thin dead band.
  - Dropped the basement stair lane start a little lower so the stair path connects cleanly to the raised main floor.
  - Kept gates, spawns, and `blockedZones` unchanged.

## 2026-04-04 living-room basement gate nudge + kitchen collision rebuild

Focused only on the remaining living-room basement trigger and the kitchen collision layout.

- `src/rooms/living-room/room.js`
  - Moved the basement gate trigger upward on the right stair so `Press E to enter Basement` appears higher on the stair run instead of only near the bottom.
  - Kept the basement spawn unchanged because the arrival point was already landing well enough.

- `src/rooms/kitchen/room.js`
  - Rebuilt the kitchen walkable areas to match the visible wooden floor and the bottom doorway tiles only.
  - Added blocked zones for the upper wall/void, the raised upper tiled section, and the side upper alcoves so the player cannot walk into non-floor art.
  - Kept the kitchen interactables in place so they remain reachable from the real floor edge.

## 2026-04-04 blue-line collision shape pass

Recut the living-room, basement, and kitchen collision shapes again to better match the intended room art boundaries from the latest visual notes.

- `src/rooms/living-room/room.js`
  - Reshaped the basement-stair side from broad stacked strips into a clearer top landing, vertical stair-side lane, and lower stair-mouth path.
  - Raised the upper stair-side walkable boundary to match the intended top floor line more closely.

- `src/rooms/basement/room.js`
  - Split the stair-side walkable area into an upper stair lane plus a lower landing shape so the player can come off the stairs naturally.
  - Tightened the stair-side blocked strip so it covers the wall edge without eating too much of the landing.

- `src/rooms/kitchen/room.js`
  - Carried the middle upper blocked shape higher into the raised section.
  - Lowered the right-side blocked shape a bit so the right wall boundary better matches the visible upper band.
  - Adjusted the thin front walkable edge so the player stays on the intended lower floor line.

## 2026-04-04 collision simplification pass for living room, basement, and kitchen

Simplified the room collision setup in the living room, basement, and kitchen so these rooms rely mainly on a few clean `walkableZones` instead of overlapping blocked strips.

- `src/rooms/living-room/room.js`
  - Removed the wide upper `blockedZones` rectangle entirely.
  - Reshaped the basement-side movement path into three simple walkable pieces: upper landing, stair lane, and stair mouth.

- `src/rooms/basement/room.js`
  - Removed both basement `blockedZones`, including the stair-side obstacle strip.
  - Kept the basement collision as three clear walkable shapes: main floor, upper stair lane, and stair landing.

- `src/rooms/kitchen/room.js`
  - Removed all kitchen `blockedZones`.
  - Kept movement on the lower wood-floor area with a thin front strip under the raised tile section so upper interactables still stay reachable from the correct side.

## 2026-04-04 kitchen phone accessibility tweak

Moved the kitchen phone down onto reachable floor space so it no longer sits inside the blocked upper section.

- `src/rooms/kitchen/room.js`
  - Moved `phone` from `x 0.78`, `y 0.34` to `x 0.78`, `y 0.58`.

## 2026-04-04 narrow stair collision cleanup + kitchen floor boundary pass

Made one last room-specific collision cleanup pass in the living room, basement, and kitchen without changing gate behavior or rewriting movement logic.

- `src/rooms/living-room/room.js`
  - Widened the three basement-stair walkable strips so the upper landing, middle stair run, and lower stair foot connect more naturally.
  - Kept the current basement spawn and gate placement.

- `src/rooms/basement/room.js`
  - Extended the main floor slightly toward the stair side.
  - Widened the stair walkable lane and lowered it farther into the landing so the player can step off the stairs more smoothly.
  - Shrunk the stair-side blocked strip so it blocks the wall edge only instead of crowding the landing.

- `src/rooms/kitchen/room.js`
  - Lowered the main wooden-floor walkable start so the player cannot stand too high near the raised upper section.
  - Added a thin front walkable strip under the counter/tile edge so top-side interactables remain reachable from the correct floor boundary.
  - Expanded the blocked area across the upper raised section and side wall bands to keep the player out of the non-floor region.

## 2026-04-04 basement stair collision fix + collision debug overlay

Fixed the basement stair landing so entering from the living room no longer drops the player onto a blocked strip, then tightened the upstairs/downstairs stair spawns to sit closer to the visible final steps. Also added a simple visual collision overlay for fast room tuning.

- `src/controllers/movementController.js`
  - Added `findNearestWalkablePosition(...)` so room transfers can recover to the nearest valid floor when a raw spawn lands too close to a blocked zone.

- `src/core/game.js`
  - Room transfers now validate the destination spawn against the destination room's collision layout before placing the player.
  - Added `window.SheshProhorDebug.showCollisionOverlay` flag support.
  - Debug overlay now draws:
    - `walkableZones`
    - `blockedZones`
    - gate areas
    - inbound spawn markers
    - the player foot probe

- `src/rooms/basement/room.js`
  - Recut the right stair walkable lane so the basement arrival point can step naturally off the stairs.
  - Replaced the old stair-side blocked strip with a narrower wall-only block beside the stair shaft.
  - Moved the return-to-living-room spawn slightly higher on the visible stair run.

- `src/rooms/living-room/room.js`
  - Moved the basement arrival spawn higher on the stair lane so it lands on the visible final step instead of the floor edge.
  - Nudged the upstairs arrival spawn slightly deeper onto the children's-room stair foot.

- `src/rooms/children-room/room.js`
  - Moved the living-room arrival spawn upward so coming downstairs lands closer to the final visible stair step.

## 2026-04-04 stair remap

Updated room transitions to match the visible stairs in the current background art.

- `src/rooms/living-room/room.js`
  - Narrowed the kitchen gate to the lower-left edge only: `side:left`, `range 0.58 -> 0.92`.
  - Added upstairs gate on the left staircase using an area trigger:
    - `x: 0.02 -> 0.19`
    - `y: 0.16 -> 0.49`
    - target: `children-room`
    - spawn in bedroom: `x 0.18`, `y 0.66`
  - Removed the old bottom basement drop.
  - Added basement gate on the right staircase using an area trigger:
    - `x: 0.76 -> 0.96`
    - `y: 0.42 -> 0.74`
    - target: `basement`
    - spawn in basement: `x 0.82`, `y 0.24`
  - Moved the `frontDoor` interactable higher to `x 0.90`, `y 0.30` so it no longer overlaps the basement stair trigger.

- `src/rooms/children-room/room.js`
  - Replaced the old left-edge exit with a stair-area return gate that matches the bedroom stairs:
    - `x: 0.03 -> 0.20`
    - `y: 0.46 -> 0.86`
    - target: `living-room`
    - spawn in living room: `x 0.14`, `y 0.56`

- `src/rooms/basement/room.js`
  - Switched background from `basementTiles.jpg` to `basement.jpg`.
  - Moved `basementStairs` interactable to the visible upper-right stairs: `x 0.92`, `y 0.14`.
  - Replaced the old full top-edge return with a stair-area return gate:
    - `x: 0.88 -> 1.00`
    - `y: 0.00 -> 0.28`
    - target: `living-room`
    - spawn in living room: `x 0.78`, `y 0.66`

## 2026-04-04 stair tightening + audio hookup

Adjusted the upper-floor and basement transitions so the player has to use the visible stair paths instead of clipping through the side edges or stair rail area. Also connected the existing repo audio manifest to the actual runtime.

- `src/rooms/children-room/room.js`
  - Tightened the bedroom return gate to the lower-left stair opening only.
  - New gate area:
    - `x: 0.05 -> 0.16`
    - `y: 0.57 -> 0.92`
  - Updated living-room spawn after coming down the stairs:
    - `x 0.12`, `y 0.62`

- `src/rooms/living-room/room.js`
  - Tightened the basement gate so walking straight right along the railing no longer enters the basement.
  - New basement stair gate area:
    - `x: 0.83 -> 0.96`
    - `y: 0.58 -> 0.90`
  - Updated basement spawn to land closer to the visible stair exit:
    - `x 0.86`, `y 0.26`

- `src/rooms/basement/room.js`
  - Tightened the return gate to the upper-right stair mouth for consistency.
  - New return gate area:
    - `x: 0.89 -> 1.00`
    - `y: 0.02 -> 0.29`
  - Updated living-room spawn when coming back up:
    - `x 0.84`, `y 0.74`

- `src/audio/audio.js`
  - Replaced the unused ES module manifest with a browser-runtime `window.AudioManager`.
  - Added audio unlock handling for browser autoplay restrictions.
  - Added ambience switching by threat level, footstep playback while moving, and simple event/interactable sound hooks.

- `src/core/game.js`
  - Hooked audio into threat updates, room changes, event triggers, interactable use, and movement state.

- `game.html`
  - Added the `src/audio/audio.js` script so audio loads with the game.

## 2026-04-04 obstacle pass + stair-path recalibration

Recalibrated the stair transitions against the updated room art and added room-level walkable zones so the player cannot walk through black void, wall bands, window rows, or stair rail cut-throughs.

- `src/controllers/movementController.js`
  - Added normalized walkable-zone and blocked-zone checks based on the player's foot position.
  - Added `resolveRoomCollision(...)` so movement slides along valid floor areas instead of clipping through blocked art.

- `src/core/game.js`
  - Switched player movement from simple screen clamping to room-aware collision resolution.
  - Existing audio hooks remain active while moving through the new pathing rules.

- `src/rooms/children-room/room.js`
  - Added bedroom walkable zones so the visible stairwell is the only valid way down.
  - Added blocked zones for the top wall/window band and large furniture footprint.
  - Tightened the living-room return gate to the lower stair mouth only:
    - `x: 0.05 -> 0.14`
    - `y: 0.76 -> 0.93`
  - Updated upstairs/living-room stair spawns so the player appears on the stair path instead of beside it.
  - Nudged `olderChild` to a clearer floor position so the new obstacle zones do not overlap their interaction area.

- `src/rooms/living-room/room.js`
  - Split the living room into floor, upper stair, front-door access, and basement-stair path zones.
  - Added blocked zones for the upper wall/window band and the right stair railing cut-through.
  - Tightened the upstairs gate to the visible upper-left stair top:
    - `x: 0.05 -> 0.15`
    - `y: 0.19 -> 0.40`
  - Tightened the basement gate to the lower-right stair run so walking straight right no longer drops into the basement:
    - `x: 0.86 -> 0.95`
    - `y: 0.79 -> 0.92`
  - Raised the `frontDoor` interactable slightly so it stays reachable from the door-side floor strip.

- `src/rooms/kitchen/room.js`
  - Added room-shaped walkable zones for the kitchen floor and lower hall so black corners and top wall space are no longer walkable.

- `src/rooms/basement/room.js`
  - Added basement walkable zones for the main floor and right stair path only.
  - Added blocked zones for the upper window/wall strip and the stair-side cut-through beside the railing.
  - Moved the upstairs return gate to the visible top section of the stair path:
    - `x: 0.88 -> 0.99`
    - `y: 0.13 -> 0.33`
  - Moved `basementStairs` and the living-room return spawn so stair travel lines up better with the updated art without dropping the player back inside the basement trigger.

## 2026-04-04 stair intent pass + room audio pass

Reworked the upstairs and basement travel again using the latest background art so stair changes require the actual stair mouth plus matching movement intent, instead of broad corner contact. Also replaced the always-on radio behavior with room-aware ambience and a persistent night clock/tick.

- `src/controllers/movementController.js`
  - Exposed `getFootProbe(...)` so room gates can use the player's feet instead of their sprite center for stair detection.

- `src/rooms/children-room/room.js`
  - Tightened the bedroom stairwell floor strip and added a blocked zone over the upper-left wall/void.
  - Narrowed the downstairs gate to the visible lower stair mouth only:
    - `x: 0.08 -> 0.16`
    - `y: 0.80 -> 0.95`
  - Added stair-intent activation so coming down now requires moving `left` or `down`.
  - Updated the living-room spawn to land on the left stair path instead of the bedroom corner.

- `src/rooms/living-room/room.js`
  - Recut the main floor, upper-left stair, and basement stair walkable strips against the current image.
  - Expanded the right stair path so the player can reach the basement stairs again while still blocking the railing cut-through.
  - Raised the `frontDoor` interactable slightly onto the reachable upper stair landing.
  - Upstairs gate now requires the visible stair top plus `left/up` intent.
  - Basement gate now requires the lower stair run plus `right/down` intent:
    - `x: 0.88 -> 0.97`
    - `y: 0.82 -> 0.95`

- `src/rooms/basement/room.js`
  - Recut the basement floor and right stair shaft to better follow the current art.
  - Tightened the return gate to the upper stair mouth and added `right/up` stair-intent activation.
  - Moved the basement stair interactable slightly higher so it stays visually aligned with the stair opening.
  - Updated the living-room return spawn so the player comes back onto the lower stair path instead of the railing edge.

- `src/core/game.js`
  - Gate checks now use the player's foot probe instead of sprite-center contact.
  - Added stair-intent matching for room gates, so touching a corner alone is no longer enough to switch rooms.
  - Added a persistent 15-minute night clock that always shows in the HUD and resets on page refresh.
  - Dialogue choice panels now show their own remaining seconds in the dialogue kicker while the night clock keeps running in the HUD.
  - Added per-frame audio updates so the new clock tick and random wind cues stay in sync.

- `src/core/gameState.js`
  - Added `systems.night` with `duration` and `remaining` so the HUD timer can function as a real session clock.

- `src/audio/audio.js`
  - Added menu music support using `Zander Noriega - Perpetual Tension.mp3`.
  - Replaced the old always-on radio behavior with room-aware ambience:
    - `Dark_Rainy_Night(ambience).ogg` in `children-room` and `kitchen`
    - `rain_indoors_2.wav` in `basement`
  - Radio static now plays only when the radio is actually interacted with.
  - Added persistent clock ticking during gameplay and occasional wind one-shots outside the basement.
  - Added cat purr interaction audio.

- `index.html`
  - Wired the main menu to the shared audio manager.

- `src/menu/menu.js`
  - Added a tiny menu bootstrap that starts the menu theme after the browser unlocks audio.

## 2026-04-04 living-room floor obstacle removal

Removed the extra floor-level blocked zone from the living room so movement across the main floor is less restrictive again.

- `src/rooms/living-room/room.js`
  - Removed the lower-right floor blocking rectangle.
  - Kept the upper wall/window blocked band in place.


## 2026-04-04 gate prompt UX pass

Updated room transitions so gates behave like clear doorways instead of silent teleport zones.

- src/core/game.js`r
  - Room transitions no longer happen automatically on gate contact.
  - Added active-gate detection plus Press E ... hints.
  - Kept SPACE for normal object interaction.
  - Combined gate and interactable hints when both are available in the same spot.
  - Added small helper comments so the flow stays beginner-friendly.

- src/rooms/living-room/room.js`r
  - Widened kitchen, upstairs, and basement gate areas.
  - Added human-readable gate labels.
  - Kept spawns slightly inside destination rooms.

- src/rooms/children-room/room.js`r
  - Widened the downstairs stair gate.
  - Added a readable gate label and kept the living-room spawn slightly inward.

- src/rooms/basement/room.js`r
  - Widened the upstairs return gate.
  - Added a readable gate label and kept the living-room spawn slightly inward.

- src/rooms/kitchen/room.js`r
  - Widened the living-room exit gate and moved the spawn slightly inward.

## 2026-04-04 stair landing pass

Adjusted the room-transfer landing spots so the player appears on the last visible stair step instead of too far onto the floor. Also added a short transition cooldown so landing on a stair does not immediately retrigger another gate.

- src/rooms/children-room/room.js`r
  - Bedroom to living-room transfer now lands lower on the left staircase in the living room.

- src/rooms/living-room/room.js`r
  - Living-room to bedroom transfer now lands deeper onto the bedroom stair foot.
  - Living-room to basement transfer now lands near the top of the basement stair run.

- src/rooms/basement/room.js`r
  - Basement to living-room transfer now lands on the last visible basement stair step in the living room.

- src/core/game.js`r
  - Added a short gateCooldown after each transfer to force a clean arrival position before any new gate can activate.

