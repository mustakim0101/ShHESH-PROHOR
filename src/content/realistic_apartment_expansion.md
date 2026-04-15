# Realistic Apartment Expansion

This plan expands the current four-room layout into a more believable apartment while keeping the game readable for navigation and event design.

## Design Goals

- Keep the apartment realistic instead of maze-like.
- Preserve short, tense travel times between important rooms.
- Add a few more rooms without making the player lost all the time.
- Create a layout that feels like one connected home with a service basement.

## Proposed Layout

### Main Floor

```text
 [Balcony]
     |
 [Dining] -- [Living Room] -- [Entry Hall] -- [Bathroom]
                 |                |
             [Kitchen]        [Study]
                 |
            [Storage/Pantry]
```

### Upper Floor

```text
 [Parents' Bedroom] -- [Upper Hall] -- [Children's Room]
                              |
                       [Small Prayer Nook]
```

### Lower Floor

```text
 [Basement Stairs] -- [Basement Utility Area] -- [Safe Corner]
                              |
                         [Store Room]
```

## Room List

### Existing Rooms

- `living-room`
- `kitchen`
- `children-room`
- `basement`

### New Rooms

- `entry-hall`
- `bathroom`
- `study`
- `dining-room`
- `storage-room`
- `parents-room`
- `upper-hall`
- `prayer-nook`
- `basement-store`

## Why This Layout Works

- The living room stays the emotional center of the apartment.
- The kitchen still connects naturally to everyday survival tasks.
- The upper floor becomes a believable family/private area instead of only one bedroom.
- The entry hall gives the front door side more realism and more room for tension events.
- The basement remains important, but gets one extra storage branch instead of becoming a maze.

## Recommended Navigation Flow

### Core Family Loop

`living-room -> kitchen -> dining-room -> living-room`

This supports domestic tasks and keeps the lower floor feeling inhabited.

### Threat Loop

`living-room -> entry-hall -> bathroom/study`

This gives the front side of the apartment more believable depth for knock, noise, or hiding events.

### Family Protection Loop

`living-room -> stairs -> upper-hall -> children-room / parents-room`

This creates realistic upstairs travel without overcomplicating navigation.

### Final Safety Loop

`living-room -> basement stairs -> basement utility area -> safe corner`

This keeps the current basement ending readable and strong.

## Suggested Gate Connections

Use direct gates like the current room setup, but keep the connections clean and believable.

### Main Floor Gates

- `living-room <-> kitchen`
- `living-room <-> dining-room`
- `living-room <-> entry-hall`
- `kitchen <-> storage-room`
- `entry-hall <-> bathroom`
- `entry-hall <-> study`
- `dining-room <-> balcony`

### Vertical Gates

- `living-room <-> upper-hall`
- `upper-hall <-> children-room`
- `upper-hall <-> parents-room`
- `upper-hall <-> prayer-nook`
- `living-room <-> basement`
- `basement <-> basement-store`

## Recommended Story Use

### Living Room

- TV
- family gathering
- early-night confusion

### Kitchen

- candle
- phone
- radio
- storage access

### Dining Room

- table event
- meal remnants
- window-side tension

### Entry Hall

- front-door scenes
- footsteps
- shadow/sound cues

### Study

- papers
- documents
- emergency contact list

### Bathroom

- mirror scene
- water/drip sound cue
- hide-and-breathe beat

### Parents' Bedroom

- medicine
- flashlight
- personal stakes

### Upper Hall

- fast route between bedrooms
- stair tension

### Prayer Nook

- emotional pause
- symbolic item

### Basement Store

- old supplies
- locked box
- optional hidden item

## Collision Design Rules

For every new room:

- Keep one broad `walkableZone` for the visible floor.
- Add small `blockedZones` only for furniture, railings, counters, wall voids, or black background cutouts.
- Do not use large blocked rectangles when a narrow obstacle strip will do.
- Keep stair mouths and door thresholds slightly generous so transitions feel smooth.

## Visual Architecture Rules

- Public spaces should be wider: `living-room`, `dining-room`, `entry-hall`.
- Private spaces should be tighter: `bathroom`, `study`, `prayer-nook`, `storage-room`.
- Use railings only where the floor visibly changes height.
- Keep windows and upper-wall bands non-walkable.
- Avoid dead black voids touching walkable floor unless they are explicitly blocked.

## Recommended Build Order

1. Add `entry-hall` and connect it to `living-room`.
2. Add `study` and `bathroom` as short branches from `entry-hall`.
3. Add `upper-hall` and split the upstairs flow into multiple rooms.
4. Add `parents-room` beside `children-room`.
5. Add `dining-room` and `storage-room` near the kitchen.
6. Add `prayer-nook` and `basement-store` as optional flavor spaces.

## File Plan

Create these room files when you are ready to implement:

- `src/rooms/entry-hall/room.js`
- `src/rooms/bathroom/room.js`
- `src/rooms/study/room.js`
- `src/rooms/dining-room/room.js`
- `src/rooms/storage-room/room.js`
- `src/rooms/parents-room/room.js`
- `src/rooms/upper-hall/room.js`
- `src/rooms/prayer-nook/room.js`
- `src/rooms/basement-store/room.js`

## Asset Guidance

If you create or collect background images later, prioritize these first:

- `entry-hall`
- `upper-hall`
- `parents-room`
- `dining-room`

Those four will make the apartment feel much larger immediately.

## Assumptions

- The apartment remains one family home, not a whole apartment building.
- The basement is a service/storage level attached to the home.
- The game should stay realistic and emotionally grounded, not puzzle-maze focused.
