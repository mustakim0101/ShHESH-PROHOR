(function () {
  const content = {
    rooms: {
    livingRoom: {
      id: "livingRoom",
      name: "Living Room",
      description: "",
      mood: "",
      interactableIds: ["tv", "frontDoor", "toyRobot", "wallClock"],
    },
    kitchen: {
      id: "kitchen",
      name: "Kitchen",
      description: "",
      mood: "",
      interactableIds: ["radio", "kitchenDrawer2", "kitchenDrawer3", "cat"],
    },
    childrensRoom: {
      id: "childrensRoom",
      name: "Children's Room",
      description: "",
      mood: "",
      interactableIds: ["olderChild", "youngerChild", "familyDrawing"],
    },
    basement: {
      id: "basement",
      name: "Basement",
      description: "",
      mood: "",
      interactableIds: ["basementStairs", "basementDoor", "safeCorner"],
    },
  },

  interactables: {
    tv: {
      id: "tv",
      roomId: "livingRoom",
      label: "TV",
      type: "device",
      description: "",
    },
    frontDoor: {
      id: "frontDoor",
      roomId: "livingRoom",
      label: "Front Door",
      type: "door",
      description: "",
    },
    toyRobot: {
      id: "toyRobot",
      roomId: "livingRoom",
      label: "Toy Robot",
      type: "object",
      description: "",
    },
    wallClock: {
      id: "wallClock",
      roomId: "livingRoom",
      label: "Wall Clock",
      type: "environment",
      description: "",
    },
    radio: {
      id: "radio",
      roomId: "kitchen",
      label: "Radio",
      type: "device",
      description: "",
    },
    kitchenDrawer2: {
      id: "kitchenDrawer2",
      roomId: "kitchen",
      label: "Second Drawer",
      type: "storage",
      description: "",
    },
    kitchenDrawer3: {
      id: "kitchenDrawer3",
      roomId: "kitchen",
      label: "Third Drawer",
      type: "storage",
      description: "",
    },
    cat: {
      id: "cat",
      roomId: "kitchen",
      label: "Cat",
      type: "character",
      description: "",
    },
    olderChild: {
      id: "olderChild",
      roomId: "childrensRoom",
      label: "Older Child",
      type: "character",
      description: "",
    },
    youngerChild: {
      id: "youngerChild",
      roomId: "childrensRoom",
      label: "Younger Child",
      type: "character",
      description: "",
    },
    familyDrawing: {
      id: "familyDrawing",
      roomId: "childrensRoom",
      label: "Family Drawing",
      type: "memory",
      description: "",
    },
    basementStairs: {
      id: "basementStairs",
      roomId: "basement",
      label: "Basement Stairs",
      type: "transition",
      description: "",
    },
    basementDoor: {
      id: "basementDoor",
      roomId: "basement",
      label: "Basement Door",
      type: "door",
      description: "",
    },
    safeCorner: {
      id: "safeCorner",
      roomId: "basement",
      label: "Safe Corner",
      type: "safeZone",
      description: "",
    },
  },

  events: {
    event01: {
      id: "event01",
      title: "Conflicting Signals",
      trigger: "Start of the night. The player checks the TV, radio, and phone for conflicting information.",
      summary:
        "Three sources say three different things. None of them feel fully reliable. The player has to decide which one to trust first.",
      taskIds: ["checkTv", "checkRadio", "checkPhone"],
      choiceIds: ["trustTv", "trustRadio", "trustPhone"],
      outcomeIds: ["tvChosen", "radioChosen", "phoneChosen"],
      script: {
        setup: "The room is still lit. The apartment feels ordinary in a way that is already starting to slip.",
        beat1: "The TV says one thing.",
        beat2: "The radio says another.",
        beat3: "The phone brings a third version late, from someone close enough to worry.",
        resolution: "You cannot verify anything. You can only decide what kind of uncertainty to trust.",
      },
    },
    event02: {
      id: "event02",
      title: "The Question",
      trigger:
        "After the first wave of information, the younger child appears and asks if everything is okay.",
      summary:
        "The younger child stands in the doorway and starts counting softly while waiting for an answer. The moment is small, but it shapes the rest of the night.",
      taskIds: ["goToChild", "answerChild"],
      choiceIds: ["reassure", "deflect", "staySilent"],
      outcomeIds: ["childComforted", "childUnsettled", "childWithdraws"],
      script: {
        setup: "The younger child is awake now. Their voice is small enough that it makes the room feel larger.",
        beat1: "They ask one direct question.",
        beat2: "Then they start counting quietly, as if the counting itself might hold the room together.",
        resolution: "Your answer lands immediately. So does your lack of one.",
      },
    },
    event03: {
      id: "event03",
      title: "The Blackout",
      trigger: "The power cuts while the player is still trying to make sense of the night.",
      summary:
        "The apartment drops into near-darkness. The player has to reach the kitchen, find the candle, and get light back before the phone battery drains too far.",
      taskIds: ["reachKitchen", "openDrawer", "findCandle", "lightCandle"],
      choiceIds: [],
      outcomeIds: ["candleLit", "batteryDrained"],
      script: {
        setup: "The power goes out all at once.",
        beat1: "The familiar shape of the apartment disappears.",
        beat2: "The phone becomes a tool and a loss at the same time.",
        resolution: "Light returns only in a small circle, and only if you can get to it in time.",
      },
    },
    event04: {
      id: "event04",
      title: "The Knock",
      trigger: "The moment the candle is lit, someone knocks at the front door.",
      summary:
        "The knock comes in the dark while the older child is unsettled and moving toward the front of the apartment. The player must decide whether to answer, hide, or pull the family back.",
      taskIds: ["goToDoor", "checkChild", "hideOrRespond"],
      choiceIds: ["stayQuiet", "speakThroughDoor", "moveAway"],
      outcomeIds: ["doorStaysClosed", "presenceRevealed", "childRedirected"],
      script: {
        setup: "The candle catches. Before relief has time to settle, the knocking starts.",
        beat1: "Three knocks. Silence.",
        beat2: "Two more. Slower. Deliberate.",
        beat3: "The older child is already thinking about the door.",
        resolution: "Whatever you do next tells the apartment whether you are still hidden or not.",
      },
    },
    event05: {
      id: "event05",
      title: "Stay Together",
      trigger: "After the knock at the front door, the mother pulls back from the entrance and tries to keep the family together until morning.",
      summary:
        "The apartment is still dark, the candle is still small, and the children need a place to settle. The player heads back to the children's room and makes one final promise to hold the night together.",
      taskIds: ["returnToChildrenRoom", "checkYoungerChildAgain", "stayWithFamily"],
      choiceIds: ["stayTogether"],
      outcomeIds: ["familyHeldTogether"],
      script: {
        setup: "The knocking passes, but the apartment does not become safe again.",
        beat1: "The candle gives you just enough light to see their faces.",
        beat2: "That small circle of light becomes the only plan that still matters.",
        resolution: "The rest of the night is no longer about answers. It is about staying together until morning.",
      },
    },
    event06: {
      id: "event06",
      title: "The Empty Bed",
      trigger: "Later in the night, the player returns to the children's room and finds the older child's bed empty.",
      summary:
        "The older child has gone to the basement alone. The player has to search fast and reach them before they get too close to the outside door.",
      taskIds: ["goToChildrensRoom", "searchBasement", "reachOlderChild"],
      choiceIds: ["callSoftly", "runImmediately"],
      outcomeIds: ["olderChildReached", "olderChildTooLate"],
      script: {
        setup: "One bed is occupied. The other is empty in a way that changes the whole apartment.",
        beat1: "The older child is not lost. They made a choice.",
        beat2: "You still have time to catch up to that choice, but not much.",
        resolution: "If you reach them, the night stays human. If you do not, it hardens.",
      },
    },
    event07: {
      id: "event07",
      title: "Morning Decision",
      trigger: "Near dawn, the radio breaks through with a single word and the player has to decide what to do next.",
      summary:
        "The night is almost over, but not finished. The player makes one last choice while carrying everything that happened before it.",
      taskIds: ["gatherFamily", "goToBasement", "waitForDawn"],
      choiceIds: ["stayHidden", "goUpstairs", "trustTheSignal"],
      outcomeIds: ["morningComes", "almostEnding", "notYetEnding"],
      script: {
        setup: "The radio gives you one word and no proof.",
        beat1: "Dawn is visible only as a possibility.",
        beat2: "Your final decision is shaped by every smaller one that came before it.",
        resolution: "Morning is not something you win. It is something you reach, if the night lets you.",
      },
    },
  },

  dialogue: {
    tv: {
      intro: "The picture keeps breaking apart. A presenter is speaking too calmly.",
      warning: "Stay indoors until further notice. Do not gather near windows.",
      staticBreak: "The screen crackles. Half a sentence disappears into static.",
    },
    radio: {
      news: "A voice on the radio says the roads are still open, but only for a little while.",
      static: "Static. Then a few words. Then static again.",
      biryaniShow: "Now add the fried onions in layers. Do not rush this part.",
      dawnWord: "Clear.",
    },
    phone: {
      neighborMessage: "Are you awake? I heard something outside.",
      familyMessage: "Keep the lights low. Message me if it gets worse.",
      missedMessage: "Message failed to send.",
      lowBatteryWarning: "Battery low.",
      deadScreen: "The screen goes black.",
      chargerFound: "The charger is here. You should have taken it earlier.",
      autocorrectDraft: "stay safe",
      autocorrectSent: "stay safe lol",
      bossReply: "Okay noted, see you Monday.",
    },
    youngerChild: {
      counting: ["One...", "Two...", "Three..."],
      question: "Are we okay?",
      comforted: "Okay. Can I stay here for a little while?",
      afraid: "You are not telling me.",
      dawnLine: "Is it morning now?",
      biryaniLine: "Can we make biryani today?",
    },
    olderChild: {
      restless: "I heard something near the door.",
      duringKnock: "Should I check who it is?",
      sentBack: "Okay. I'll go back.",
      reunionSafe: "I heard something. I wanted to check.",
      reunionLate: "I thought you were behind me.",
    },
    parent: {
      selfTalk: [
        "None of them sound sure.",
        "Pick one. Then keep moving.",
        "Just get to the kitchen.",
        "Do not let them reach the door.",
        "Not the phone too.",
        "Please be down here.",
      ],
      gatherFamily: [
        "Stay close to me.",
        "We're going downstairs.",
        "Do not let go of my hand.",
      ],
    },
    knock: {
      first: "Three knocks. Then silence.",
      second: "Two more. Slower this time.",
      voiceBehindDoor: "Hello? Are you there?",
    },
  },

  endings: {
    morningComes: {
      id: "morningComes",
      title: "Morning Comes",
      condition: "Threat stays low enough and the family remains together by dawn.",
      summary:
        "Light reaches the apartment slowly. The younger child stands at the window. The older child tries to make tea and does it badly. Nothing is fixed, but everyone is still here.",
      text: [
        "Morning enters the apartment quietly.",
        "The younger child stands by the window and does not ask anything for a while.",
        "The older child makes tea badly but with care.",
        "Nothing is resolved. Everyone is still here.",
      ],
    },
    almost: {
      id: "almost",
      title: "Almost",
      condition: "The family survives the night, but one choice leaves a lasting absence or silence.",
      summary:
        "Morning still comes, but it arrives quietly. Something is missing from the apartment. No one says it out loud.",
      text: [
        "Morning still comes.",
        "It arrives to a room that has kept too much inside it.",
        "No one says what is missing.",
        "No one needs to.",
      ],
    },
    notYet: {
      id: "notYet",
      title: "Not Yet",
      condition: "Threat rises too far before dawn or the final decision goes wrong.",
      summary:
        "The darkness does not lift. The night does not end cleanly. A final question hangs in the room, unanswered.",
      text: [
        "Dawn is close, but it does not reach you.",
        "The room stays dark around the edges.",
        "The younger child asks one more question.",
        "You do not answer in time.",
      ],
    },
    biryaniVariant: {
      id: "biryaniVariant",
      title: "Biryani Variant",
      condition: "The safe ending is reached while the biryani show remains part of the night.",
      summary:
        "Morning comes as usual, and then the younger child asks the smallest possible question about food. It lands harder than anything else.",
      text: [
        "The apartment brightens slowly.",
        "The radio is still on somewhere in the background.",
        "The younger child looks up and asks, 'Can we make biryani today?'",
        "That is when the night finally ends.",
      ],
    },
  },

  uiText: {
    tasks: {
      checkTv: "Walk to the TV.",
      checkRadio: "Go to the kitchen radio.",
      checkPhone: "Check the phone.",
      goToChild: "Go to the younger child.",
      answerChild: "Answer the question.",
      reachKitchen: "Run to the kitchen.",
      openDrawer: "Open the third drawer.",
      findCandle: "Take the candle.",
      lightCandle: "Light the candle.",
      goToDoor: "Go to the front door.",
      checkChild: "Find the older child.",
      hideOrRespond: "Decide whether to hide or respond.",
      returnToChildrenRoom: "Go back to the children's room.",
      checkYoungerChildAgain: "Check on the younger child.",
      stayWithFamily: "Stay with the children until morning.",
      findCharger: "Find the charger.",
      goToChildrensRoom: "Go to the children's room.",
      searchBasement: "Search the basement.",
      reachOlderChild: "Reach the older child.",
      gatherFamily: "Gather the family.",
      goToBasement: "Take everyone to the basement.",
      waitForDawn: "Wait for dawn.",
    },
    taskQueues: {
      event01: ["Walk to the TV.", "Go to the kitchen radio.", "Check the phone.", "Choose which source to trust."],
      event02: ["Go to the younger child.", "Listen to the counting.", "Answer the question."],
      event03: ["Run to the kitchen.", "Open the third drawer.", "Take the candle.", "Light it."],
      event04: ["Go to the front door.", "Find the older child.", "Stay quiet or answer."],
      event05: ["Go back to the children's room.", "Check on the younger child.", "Stay with the family until morning."],
      event06: ["Go to the children's room.", "See that the bed is empty.", "Run to the basement.", "Reach the older child before the outside door."],
      event07: ["Gather the family.", "Decide where to wait.", "Make the final choice."],
    },
    prompts: {
      interact: "Press E or SPACE to interact.",
      choose: "Use Arrow Up / Down and Enter to choose.",
      hide: "Press Arrow Down to crouch and hide.",
      stairs: "Press Arrow Up to use the stairs.",
    },
    status: {
      lowBattery: "Phone battery is low.",
      phoneDead: "The phone screen is dark now.",
      candleLit: "Candle lit. Stay close and keep moving.",
      blackoutActive: "The blackout is active. Hurry before the battery drops more.",
      phoneMatters: "Phone battery matters during the night.",
      signalLost: "Signal lost.",
      threatRising: "Something feels wrong.",
      familySafe: "The family is together.",
      familyWaiting: "Keep the family together until dawn.",
      familyHeld: "The family stays together for now.",
    },
    hints: {
      headToChildrenRoom: "Head to the children's room.",
      reachChildAndInteract: "Go to the younger child and press E or SPACE to interact.",
      blackoutStart: "The room is dark now. Go to the kitchen and find the candle.",
      relightCandle: "Press E or SPACE again on the drawer to light the candle.",
      frontDoorChoice: "Someone is at the door. Go there or check on the older child.",
      returnToChildren: "Take the candle back to the children.",
      stayCloseToChild: "Stay close to the younger child and press E or SPACE.",
      familyHeldHint: "Keep the candle close. The family stays together for now.",
      toyRobotOff: "The toy robot is silent now.",
      chooseSource: "Choose which source to trust.",
      event03Complete: "The flame catches. The apartment comes back in pieces.",
      frontDoorChild: "The older child hesitates near the front of the room.",
    },
    event01: {
      intro:
        "The TV, radio, and phone are all telling different versions of the same night.",
      choices: {
        trustTv: "Trust the TV.",
        trustRadio: "Trust the radio.",
        trustPhone: "Trust the phone.",
      },
      outcomes: {
        tvChosen: "You decide to trust the TV, even though the signal keeps breaking.",
        radioChosen: "You decide to trust the radio. The voice sounds uncertain, but human.",
        phoneChosen: "You decide to trust the phone. A message feels personal, but late.",
      },
    },
    event02: {
      intro: "The younger child is standing in the doorway, waiting for your answer.",
      choices: {
        reassure: "We're together. Stay close to me.",
        deflect: "It's late. Try to lie down for a bit.",
        staySilent: "Say nothing.",
      },
      outcomes: {
        childComforted: "The child steps closer. The counting stops.",
        childUnsettled: "The child nods, but does not move.",
        childWithdraws: "The child looks at you for a moment, then looks away.",
      },
    },
    event03: {
      intro: "The power cuts without warning. The room drops out around you.",
      steps: [
        "Get to the kitchen.",
        "Open the third drawer.",
        "Find the candle.",
        "Light it before the phone drains further.",
      ],
      outcomes: {
        candleLit: "The flame catches. The room returns in pieces.",
        batteryDrained: "The phone screen dims in your hand. You have already used too much of it.",
      },
    },
    event04: {
      intro: "Someone knocks at the door the moment the candle is lit.",
      choices: {
        stayQuiet: "Stay quiet.",
        speakThroughDoor: "Speak through the door.",
        moveAway: "Pull away from the door and get the child back.",
      },
      outcomes: {
        doorStaysClosed: "You stay still. The silence stretches.",
        presenceRevealed: "Your voice gives the apartment away.",
        childRedirected: "You turn from the door and go to the older child first.",
      },
    },
    event05: {
      intro: "The knocking fades. The children still need you more than the door does.",
      choices: {
        stayTogether: "Stay with them until morning.",
      },
      outcomes: {
        familyHeldTogether: "You stop moving for the first time all night. The candle burns low, but everyone is still here.",
      },
    },
    event06: {
      intro: "The older child's bed is empty.",
      choices: {
        callSoftly: "Call their name softly.",
        runImmediately: "Run to the basement now.",
      },
      outcomes: {
        olderChildReached: "You reach them before they get to the outside door.",
        olderChildTooLate: "You were not fast enough. Something changes after that.",
      },
    },
    event07: {
      intro: "The radio crackles once and gives you a single word: clear.",
      choices: {
        stayHidden: "Stay where you are a little longer.",
        goUpstairs: "Go upstairs and look.",
        trustTheSignal: "Trust the word and move.",
      },
      outcomes: {
        morningComes: "The light reaches the room slowly.",
        almostEnding: "Morning comes, but it does not feel whole.",
        notYetEnding: "The night does not let go.",
      },
    },
  },
  };

  window.GameContent = content;
})();
