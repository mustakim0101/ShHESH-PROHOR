(function () {
  const SCORE = {
    tasks: {
      checkTv: 45,
      checkRadio: 45,
      checkPhone: 45,
      reachChildrenRoom: 80,
      goToChild: 70,
      answerChild: 90,
      reachKitchen: 85,
      openDrawer: 55,
      findCandle: 90,
      lightCandle: 140,
      goToDoor: 70,
      checkChild: 70,
      hideOrRespond: 110,
      returnToChildrenRoom: 80,
      checkYoungerChildAgain: 95,
      stayWithFamily: 140,
      goToBasement: 150,
      waitForDawn: 190,
    },
    choices: {
      event01: {
        trustTv: 130,
        trustRadio: 95,
        trustPhone: 65,
      },
      event02: {
        reassure: 150,
        deflect: 90,
        staySilent: 45,
      },
      event04: {
        stayQuiet: 130,
        speakThroughDoor: 55,
        moveAway: 155,
      },
      event05: {
        stayTogether: 190,
      },
    },
    milestones: {
      event03Lit: 160,
      goodEnding: 520,
      badEnding: -180,
      batteryDeath: -120,
      timeout: -160,
    },
    bonuses: {
      remainingBatteryPerPoint: 3,
      remainingSecondsPerPoint: 2,
    },
  };

  window.ScoreConfig = SCORE;
})();
