
function makePlayerProperties(name) {
  return {
    name: name,
    needGun: false,
    profileImageUrl: "",
    startAsZombie: false,
    beSecretZombie: false,
    advertising: false,
    logistics: false,
    communications: false,
    moderator: false,
    cleric: false,
    sorcerer: false,
    admin: false,
    photographer: false,
    chronicler: false,
    server: false,
    client: false,
  };
}

function populatePlayers(server, gameId, numPlayers, numStartingZombies, numDays, numShuffles) {
  let zombiesStartIndex = 0;
  let zombiesEndIndex = numStartingZombies;
  let gameStartTimestamp = new Date().getTime();
  let lifeCodeNumber = 1001;

  // For console logging only
  // let numHumans = 0;
  // let numZombies = numStartingZombies;

  // Make that many players, start that many of them as zombies, and simulate that
  // many days. In each of the days, each zombie infects a human.
  // Should end in zombiesEndIndex*(2^numDays) zombies.
  let playerIds = [];
  for (let i = 0; i < numPlayers; i++) {
    let userId = Bridge.generateUserId();
    server.register(userId, {});
    let playerId = Bridge.generatePlayerId();
    server.joinGame(playerId, userId, gameId, makePlayerProperties('Player' + i));
    playerIds.push(playerId);
  }
  playerIds = Utils.deterministicShuffle(playerIds, numShuffles);
  let lifeCodesByPlayerId = {};
  for (let i = zombiesEndIndex; i < playerIds.length; i++) {
    let lifeCode = "life-" + lifeCodeNumber++;
    lifeCodesByPlayerId[playerIds[i]] = lifeCode;
    server.addLife(Bridge.generateLifeId(), playerIds[i], lifeCode);
    // numHumans++;
  }
  // console.log(server.time, numHumans, numZombies);
  for (let i = 0; i < numDays; i++) {
    let dayStartTimestamp = gameStartTimestamp + i * 24 * 60 * 60 * 1000; // 24 hours
    for (let j = zombiesStartIndex; j < zombiesEndIndex; j++) {
      let infectorId = playerIds[j];
      let infecteeId = playerIds[zombiesEndIndex + j];
      let infecteeLifeCode = lifeCodesByPlayerId[infecteeId];
      server.setTime(dayStartTimestamp + j * 11 * 60 * 1000); // infections are spread by 11 minutes
      server.infect(Bridge.generateInfectionId(), infectorId, infecteeLifeCode);
      // console.log(server.time, --numHumans, ++numZombies);
    }
    zombiesEndIndex *= 2;

    if (i == 0) {
      // End of first day, revive the starting zombies
      server.setTime(dayStartTimestamp + i * 12 * 60 * 60 * 1000); // 12 hours past day start
      for (let j = 0; j < numStartingZombies; j++) {
        let lifeCode = "life-" + lifeCodeNumber++;
        lifeCodesByPlayerId[playerIds[j]] = lifeCode;
        server.addLife(Bridge.generateLifeId(), playerIds[j], lifeCode);
        // console.log(server.time, ++numHumans, --numZombies);
      }
      zombiesStartIndex = numStartingZombies;
    }
    if (i == 1) {
      server.setTime(dayStartTimestamp + i * 12 * 60 * 60 * 1000); // 12 hours past day start
      // End of second day, revive a 3 random humans
      for (let j = zombiesStartIndex; j < zombiesStartIndex + 3; j++) {
        let lifeCode = "life-" + lifeCodeNumber++;
        lifeCodesByPlayerId[playerIds[j]] = lifeCode;
        server.addLife(Bridge.generateLifeId(), playerIds[j], lifeCode);
        // console.log(server.time, ++numHumans, --numZombies);
      }
      zombiesStartIndex += 3;
    }
  }
}

function populatePlayersLight(server, gameId) {
  populatePlayers(server, gameId, 100, 7, 2, 3);
}

function populatePlayersHeavy(server, gameId) {
  populatePlayers(server, gameId, 300, 7, 5, 3);
}

function populateFakeServer(server, isRegistered, isAdmin, isJoined) {
  // registered, admin, and joined
  var kimUserId = Bridge.generateUserId();
  server.register(kimUserId, {});
  // registered, thats it
  let reggieUserId = Bridge.generateUserId();
  server.register(reggieUserId, {});
  // registered and is admin, not joined
  let minnyUserId = Bridge.generateUserId();
  server.register(minnyUserId, {});
  // registered and joined
  var evanUserId = Bridge.generateUserId();
  server.register(evanUserId, {});
  // just some other dude in a chat room...
  var zekeUserId = Bridge.generateUserId();
  server.register(zekeUserId, {});

  var gameId = "game-2017m";
  server.createGame(gameId, kimUserId, {name: "Test game", rulesUrl: "/firstgame/rules.html", stunTimer: 60});
  server.addAdmin(Bridge.generateAdminId(), gameId, minnyUserId);
  var kimPlayerId = Bridge.generatePlayerId();
  server.joinGame(kimPlayerId, kimUserId, gameId, makePlayerProperties('Kim the Ultimate'));
  var evanPlayerId = Bridge.generatePlayerId();
  server.joinGame(evanPlayerId, evanUserId, gameId, makePlayerProperties('Evanpocalypse'));
  var zekePlayerId = Bridge.generatePlayerId();
  server.joinGame(zekePlayerId, zekeUserId, gameId, makePlayerProperties('Zeke'));
  
  if (Utils.getParameterByName('populate', 'light') == 'heavy') {
    populatePlayersHeavy(server, gameId);
  } else {
    populatePlayersLight(server, gameId);
  }

  server.updatePlayer(kimPlayerId, {profileImageUrl: 'https://lh3.googleusercontent.com/GoKTAX0zAEt6PlzUkTn7tMeK-q1hwKDpzWsMJHBntuyR7ZKVtFXjRkbFOEMqrqxPWJ-7dbCXD7NbVgHd7VmkYD8bDzsjd23XYk0KyALC3BElIk65vKajjjRD_X2_VkLPOVejrZLpPpa2ebQVUHJF5UXVlkst0m6RRqs2SumRzC7EMmEeq9x_TurwKUJmj7PhNBPCeoDEh51jAIc-ZqvRfDegLgq-HtoyJAo91lbD6jqA2-TFufJfiPd4nOWnKhZkQmarxA8LQT0kOu7r3M5F-GH3pCbQqpH1zraha8CqvKxMGLW1i4CbDs1beXatKTdjYhb1D_MVnJ6h7O4WX3GULwNTRSIFVOrogNWm4jWLMKfKt3NfXYUsCOMhlpAI3Q8o1Qgbotfud4_HcRvvs6C6i17X-oQm8282rFu6aQiLXOv55FfiMnjnkbTokOA1OGDQrkBPbSVumz9ZE3Hr-J7w_G8itxqThsSzwtK6p5YR_9lnepWe0HRNKfUZ2x-a2ndT9m6aRXC_ymWHQGfdGPvTfHOPxUpY8mtX2vknmj_dn4dIuir1PpcN0DJVVuyuww3sOn-1YRFh80gBFvwFuMnKwz8GY8IX5gZmbrrBsy_FmwFDIvBcwNjZKd9fH2gkK5rk1AlWv12LsPBsrRIEaLvcSq7Iim9XSsiivzcNrLFG=w294-h488-no'});
  server.updatePlayer(evanPlayerId, {profileImageUrl: 'https://lh3.googleusercontent.com/WP1fewVG0CvERcnQnmxjf84IjnEBoDQBgdaxbNAECRa433neObfAjv_xI35DN67WhcCL9y-mgXmfYrZEBeJ2PYrtIeCK3KSdJ4HiEDUqxaaGsJAtu5C5ZjcABUHoySueEwO0yJWfhWPVbGoAFdP-ZquoXSF3yz4gnlN76W-ltDBglclLxKs-hR9dTjf_DiX9yGmmb5y8mp1Jb8BEw9Q-zx_j9EFkgTI0EA6T10pogxsfAWkrwXO7t37D0vI2OxzHJA51EQ4LZw1oZsIN7Uyqnh06LAJ_ykYhW2xuSCpu7QY7UPm9IbDcsDqj1eap7xvV9JW_EW2Y8Km5nS0ZoAd-Eo3zUe-2YFTc0OAVDwgbhowzo1gUeqfCEtxVHuT36Aq2LWayB6DzOL9TqubcF7qmjtNy_UIr-RY1d69xN-KqjFBoWLtS6rDhQurrfJNd5x-MYOEjCMrbsGmSXE8L7PskM3e_3-ZhIqfMn2I-4zeEZIUG8U2iHRWK-blaqsSY8uhmzNG6sqF-liyINagQF4l35oy7tpobueWs7aDjRrcJrGiQDrGHYV1E67J64Ae9FqXPHmORRpYcihQc6pI0JAmaiWwMJoqD0QMJF9koaDYANPEGbWlnWc_lFzhCO_L8yCkVtJIIItQv-loypR6XqILK32eoGeatnp5Q0x0OEm3W=s240-no'});
  server.updatePlayer(zekePlayerId, {profileImageUrl: 'https://s-media-cache-ak0.pinimg.com/736x/31/92/2e/31922e8b045a7ada368f774ce34e20c0.jpg'});
  var humanChatRoomGroupId = Bridge.generateGroupId();
  server.createGroup(humanChatRoomGroupId, kimPlayerId, {allegianceFilter: 'resistance', autoAdd: true, membersCanAdd: true, autoRemove: true});
  var humanChatRoomId = Bridge.generateChatRoomId();
  server.createChatRoom(humanChatRoomId, humanChatRoomGroupId, {name: "Resistance Comms Hub"});
  server.addPlayerToChatRoom(humanChatRoomId, evanPlayerId);
  server.addPlayerToChatRoom(humanChatRoomId, kimPlayerId);
  server.addMessageToChatRoom(Bridge.generateMessageId(), humanChatRoomId, kimPlayerId, {message: 'hi'});

  var humanSecondChatRoomGroupId = Bridge.generateGroupId();
  server.createGroup(humanSecondChatRoomGroupId, kimPlayerId, {allegianceFilter: 'resistance', autoAdd: true, membersCanAdd: true, autoRemove: true});
  var humanSecondChatRoomId = Bridge.generateChatRoomId();
  server.createChatRoom(humanSecondChatRoomId, humanSecondChatRoomGroupId, {name: "Resistance Internal Secret Police"});
  server.addPlayerToChatRoom(humanSecondChatRoomId, evanPlayerId);
  server.addPlayerToChatRoom(humanSecondChatRoomId, kimPlayerId);
  server.addMessageToChatRoom(Bridge.generateMessageId(), humanSecondChatRoomId, kimPlayerId, {message: 'lololol we\'re cops'});
  server.addMessageToChatRoom(Bridge.generateMessageId(), humanSecondChatRoomId, evanPlayerId, {message: 'lololol oink oink'});

  var zedChatRoomGroupId = Bridge.generateGroupId();
  server.createGroup(zedChatRoomGroupId, evanPlayerId, {allegianceFilter: 'horde', autoAdd: true, membersCanAdd: true, autoRemove: true});
  var zedChatRoomId = Bridge.generateChatRoomId();
  server.createChatRoom(zedChatRoomId, zedChatRoomGroupId, {name: "Horde ZedLink"});
  server.addPlayerToChatRoom(zedChatRoomId, zekePlayerId);
  server.addMessageToChatRoom(Bridge.generateMessageId(), zedChatRoomId, evanPlayerId, {message: 'zeds rule!'});
  server.addMessageToChatRoom(Bridge.generateMessageId(), zedChatRoomId, kimPlayerId, {message: 'hoomans drool!'});
  server.addMessageToChatRoom(Bridge.generateMessageId(), zedChatRoomId, kimPlayerId, {message: 'monkeys eat stool!'});
  var firstMissionId = Bridge.generateMissionId();
  server.addMission(firstMissionId, gameId, {beginTime: new Date().getTime() - 10 * 1000, endTime: new Date().getTime() + 60 * 60 * 1000, name: "first mission!", url: "/firstgame/missions/first-mission.html", allegianceFilter: 'resistance'});
  var secondMissionId = Bridge.generateMissionId();
  server.addMission(secondMissionId, gameId, {beginTime: new Date().getTime() - 10 * 1000, endTime: new Date().getTime() + 60 * 60 * 1000, name: "second mission!", url: "/firstgame/missions/second-mission.html", allegianceFilter: 'horde'});
  var rewardCategoryId = Bridge.generateRewardCategoryId();
  server.addRewardCategory(rewardCategoryId, gameId, {name: "signed up!", points: 2, seed: "derp"});
  server.addReward(Bridge.generateRewardId(), rewardCategoryId, {});
  server.addReward(Bridge.generateRewardId(), rewardCategoryId, {});
  server.addReward(Bridge.generateRewardId(), rewardCategoryId, {});
  // server.claimReward(evanPlayerId, "flarklebark");
  for (let i = 0; i < 80; i++) {
    server.addGun("gun-" + 1404 + i, {});
  }
  let mission1AlertNotificationCategoryId = Bridge.generateNotificationCategoryId();
  server.addNotificationCategory(mission1AlertNotificationCategoryId, gameId, {name: "mission 1 alert", previewMessage: "Mission 1 Details: the zeds have invaded!", message: "oh god theyre everywhere run", sendTime: new Date() / 1000 + 3600, allegianceFilter: "resistance", email: true, app: true, vibrate: true, sound: true, destination: "/2017m/missions/" + firstMissionId, icon: null});
  server.addNotification(Bridge.generateNotificationId(), kimPlayerId, mission1AlertNotificationCategoryId, {previewMessage: null, message: null, email: true, app: null, vibrate: null, sound: null, destination: null});
  let chatNotificationCategoryId = Bridge.generateNotificationCategoryId();
  server.addNotificationCategory(chatNotificationCategoryId, gameId, {name: "chat notifications", previewMessage: "Mission 1 Details: the zeds have invaded!", message: "blark flibby wopdoodle shorply gogglemog", sendTime: new Date() / 1000 + 3600, allegianceFilter: "resistance", email: true, app: true, vibrate: true, sound: true, destination: null, icon: null});
  server.addNotification(Bridge.generateNotificationId(), kimPlayerId, chatNotificationCategoryId, {previewMessage: "Ping from Evanpocalypse!", message: "blark flibby wopdoodle shorply gogglemog", email: true, app: true, vibrate: true, sound: true, destination: "/2017m/chat/" + humanChatRoomId});

  let stunQuestionId = Bridge.generateQuizQuestionId();
  server.addQuizQuestion(stunQuestionId, gameId, {
    text: "When you're a zombie, and a human shoots you with a nerf dart, what do you do?",
    type: 'order',
  });
  server.addQuizAnswer(Bridge.generateQuizAnswerId(), stunQuestionId, {
    text: "Crouch/sit down,",
    order: 0,
    isCorrect: true,
  });
  server.addQuizAnswer(Bridge.generateQuizAnswerId(), stunQuestionId, {
    text: "For 50 seconds, don't move from your spot (unless safety requires it),",
    order: 1,
    isCorrect: true,
  });
  server.addQuizAnswer(Bridge.generateQuizAnswerId(), stunQuestionId, {
    text: "Count aloud \"10, 9, 8, 7, 6, 5, 4, 3, 2, 1\",",
    order: 2,
    isCorrect: true,
  });
  server.addQuizAnswer(Bridge.generateQuizAnswerId(), stunQuestionId, {
    text: "Stand up, return to mauling humans,",
    order: 3,
    isCorrect: true,
  });

  let infectQuestionId = Bridge.generateQuizQuestionId();
  server.addQuizQuestion(infectQuestionId, gameId, {
    text: "When you're a zombie, and you touch a human, what do you do?",
    type: 'order',
  });
  server.addQuizAnswer(Bridge.generateQuizAnswerId(), infectQuestionId, {
    text: "Crouch/sit down,",
    order: 0,
    isCorrect: true,
  });
  server.addQuizAnswer(Bridge.generateQuizAnswerId(), infectQuestionId, {
    text: "Ask the human for their life code,",
    order: 1,
    isCorrect: true,
  });
  server.addQuizAnswer(Bridge.generateQuizAnswerId(), infectQuestionId, {
    text: "For 50 seconds, don't move from your spot (unless safety requires it),",
    order: 2,
    isCorrect: true,
  });
  server.addQuizAnswer(Bridge.generateQuizAnswerId(), infectQuestionId, {
    text: "Count aloud \"10, 9, 8, 7, 6, 5, 4, 3, 2, 1\",",
    order: 3,
    isCorrect: true,
  });
  server.addQuizAnswer(Bridge.generateQuizAnswerId(), infectQuestionId, {
    text: "Stand up, return to mauling humans,",
    order: 4,
    isCorrect: true,
  });

  let crossQuestionId = Bridge.generateQuizQuestionId();
  server.addQuizQuestion(crossQuestionId, gameId, {
    text: "When you want to cross the street, what do you do?",
    type: 'order',
  });
  server.addQuizAnswer(Bridge.generateQuizAnswerId(), crossQuestionId, {
    text: "Count to 15, then take off your armband,",
    order: 0,
    isCorrect: false,
  });
  server.addQuizAnswer(Bridge.generateQuizAnswerId(), crossQuestionId, {
    text: "Raise your nerf gun in the air so you're visible,",
    order: 0,
    isCorrect: false,
  });
  server.addQuizAnswer(Bridge.generateQuizAnswerId(), crossQuestionId, {
    text: "Start walking across the street, looking both ways for cars,",
    order: 0,
    isCorrect: false,
  });
  server.addQuizAnswer(Bridge.generateQuizAnswerId(), crossQuestionId, {
    text: "Get within 15 feet of a crosswalk button (now you're out of play),",
    order: 0,
    isCorrect: true,
  });
  server.addQuizAnswer(Bridge.generateQuizAnswerId(), crossQuestionId, {
    text: "Press the crosswalk button,",
    order: 1,
    isCorrect: true,
  });
  server.addQuizAnswer(Bridge.generateQuizAnswerId(), crossQuestionId, {
    text: "When the walk signal appears, walk (not run) across the crosswalk,",
    order: 2,
    isCorrect: true,
  });
  server.addQuizAnswer(Bridge.generateQuizAnswerId(), crossQuestionId, {
    text: "Once you're across, count \"3 resistance, 2 resistance, 1 resistance!\" and go,",
    order: 0,
    isCorrect: false,
  });
  server.addQuizAnswer(Bridge.generateQuizAnswerId(), crossQuestionId, {
    text: "Wait until there are no more players in the crosswalk,",
    order: 3,
    isCorrect: true,
  });
  server.addQuizAnswer(Bridge.generateQuizAnswerId(), crossQuestionId, {
    text: "Have a human count \"3 resistance, 2 resistance, 1 resistance, go!\" and the humans are in play,",
    order: 4,
    isCorrect: true,
  });
  server.addQuizAnswer(Bridge.generateQuizAnswerId(), crossQuestionId, {
    text: "When the humans go, have a zombie count \"3 zombie horde, 2 zombie horde, 1 zombie horde, go!\" and the zombies are in play,",
    order: 5,
    isCorrect: true,
  });

  if (isRegistered) {
    if (isAdmin) {
      if (isJoined) {
        return kimUserId;
      } else {
        return minnyUserId;
      }
    } else {
      if (isJoined) {
        return evanUserId;
      } else {
        return reggieUserId;
      }
    }
  } else {
    return null;
  }
}
