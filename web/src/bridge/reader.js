class Reader {
  constructor(source) {
    this.source = source;
    assert(this.source.get);
  }
  get(path) {
    return this.source.get(path);
  }
  getGamePath(gameId) {
    assert(typeof gameId == 'string' || gameId == null);
    let path = ["games"];
    if (gameId)
      path = path.concat([Utils.findIndexById(this.get(path), gameId)]);
    return path;
  }
  getGunPath(gunId) {
    assert(typeof gunId == 'string' || gunId == null);
    let path = ["guns"];
    if (gunId)
      path = path.concat([Utils.findIndexById(this.get(path), gunId)]);
    return path;
  }
  getUserPath(userId) {
    assert(typeof userId == 'string' || userId == null);
    let path = ["users"];
    if (userId)
      path = path.concat([Utils.findIndexById(this.get(path), userId)]);
    return path;
  }
  getUserPlayerPath(userId, userPlayerId) {
    assert(userId);
    assert(typeof userPlayerId == 'string' || userPlayerId == null);
    let path = this.getUserPath(userId).concat(["players"]);
    if (userPlayerId)
      path = path.concat([Utils.findIndexById(this.get(path), userPlayerId)]);
    return path;
  }
  getPlayerPath(gameId, playerId) {
    assert(gameId);
    assert(typeof playerId == 'string' || playerId == null);
    let path = this.getGamePath(gameId).concat(["players"]);
    if (playerId)
      path = path.concat([Utils.findIndexById(this.get(path), playerId)]);
    return path;
  }
  getClaimPath(gameId, playerId, rewardId) {
    assert(gameId);
    assert(playerId);
    assert(typeof rewardId == 'string' || rewardId == null);
    let path = this.getPlayerPath(gameId, playerId).concat(["claims"]);
    if (rewardId)
      path = path.concat([Utils.findIndexById(this.get(path), rewardId)]);
    return path;
  }
  getLifePath(gameId, playerId, lifeId) {
    assert(gameId);
    assert(playerId);
    assert(typeof lifeId == 'string' || lifeId == null);
    let path = this.getPlayerPath(gameId, playerId).concat(["lives"]);
    if (lifeId)
      path = path.concat([Utils.findIndexById(this.get(path), lifeId)]);
    return path;
  }
  getInfectionPath(gameId, playerId, infectionId) {
    assert(gameId);
    assert(playerId);
    assert(typeof infectionId == 'string' || infectionId == null);
    let path = this.getPlayerPath(gameId, playerId).concat(["infections"]);
    if (infectionId)
      path = path.concat([Utils.findIndexById(this.get(path), infectionId)]);
    return path;
  }
  getNotificationPath(gameId, playerId, notificationId) {
    assert(gameId);
    assert(playerId);
    assert(typeof notificationId == 'string' || notificationId == null);
    let path = this.getPlayerPath(gameId, playerId).concat(["notifications"]);
    if (notificationId)
      path = path.concat([Utils.findIndexById(this.get(path), notificationId)]);
    return path;
  }
  getMembershipPath(gameId, chatRoomId, membershipId) {
    assert(gameId);
    assert(chatRoomId);
    assert(typeof membershipId == 'string' || membershipId == null);
    let path = this.getChatRoomPath(gameId, chatRoomId).concat(["memberships"]);
    if (membershipId)
      path = path.concat([Utils.findIndexById(this.get(path), membershipId)]);
    return path;
  }
  getAdminPath(gameId, adminId) {
    assert(gameId);
    assert(typeof adminId == 'string' || adminId == null);
    let path = this.getGamePath(gameId).concat(["admins"]);
    if (adminId)
      path = path.concat([Utils.findIndexById(this.get(path), adminId)]);
    return path;
  }
  getMissionPath(gameId, missionId) {
    assert(gameId);
    assert(typeof missionId == 'string' || missionId == null);
    let path = this.getGamePath(gameId).concat(["missions"]);
    if (missionId)
      path = path.concat([Utils.findIndexById(this.get(path), missionId)]);
    return path;
  }
  getRewardCategoryPath(gameId, rewardCategoryId) {
    assert(gameId);
    assert(typeof rewardCategoryId == 'string' || rewardCategoryId == null);
    let path = this.getGamePath(gameId).concat(["rewardCategories"]);
    if (rewardCategoryId)
      path = path.concat([Utils.findIndexById(this.get(path), rewardCategoryId)]);
    return path;
  }
  getRewardPath(gameId, rewardCategoryId, rewardId) {
    assert(gameId);
    assert(rewardCategoryId);
    assert(typeof rewardId == 'string' || rewardId == null);
    let path = this.getRewardCategoryPath(gameId, rewardCategoryId).concat(["rewards"]);
    if (rewardId)
      path = path.concat([Utils.findIndexById(this.get(path), rewardId)]);
    return path;
  }
  getNotificationCategoryPath(gameId, notificationCategoryId) {
    assert(gameId);
    assert(typeof notificationCategoryId == 'string' || notificationCategoryId == null);
    let path = this.getGamePath(gameId).concat(["notificationCategories"]);
    if (notificationCategoryId)
      path = path.concat([Utils.findIndexById(this.get(path), notificationCategoryId)]);
    return path;
  }
  getChatRoomPath(gameId, chatRoomId) {
    assert(gameId);
    assert(typeof chatRoomId == 'string' || chatRoomId == null);
    let path = this.getGamePath(gameId).concat(["chatRooms"]);
    if (chatRoomId)
      path = path.concat([Utils.findIndexById(this.get(path), chatRoomId)]);
    return path;
  }
  getChatRoomMembershipPath(gameId, chatRoomId, membershipId) {
    assert(gameId);
    assert(chatRoomId);
    assert(typeof membershipId == 'string' || membershipId == null);
    let path = this.getChatRoomPath(gameId, chatRoomId).concat(["memberships"]);
    if (membershipId)
      path = path.concat([Utils.findIndexById(this.get(path), membershipId)]);
    return path;
  }
  getChatRoomMessagePath(gameId, chatRoomId, messageId) {
    assert(gameId);
    assert(chatRoomId);
    assert(typeof messageId == 'string' || messageId == null);
    let path = this.getChatRoomPath(gameId, chatRoomId).concat(["messages"]);
    if (messageId)
      path = path.concat([Utils.findIndexById(this.get(path), messageId)]);
    return path;
    return obj;
  }
  getGameIdAndPlayerIdForNotificationId(notificationId) {
    let path = this.pathForId_(notificationId);
    let gameId = this.source.get(path.slice(0, 2)).id;
    let playerId = this.source.get(path.slice(0, 4)).id;
    return [gameId, playerId];
  }
  getGameIdForNotificationCategoryId(notificationCategoryId) {
    let path = this.pathForId_(notificationCategoryId);
    return this.source.get(path.slice(0, 2)).id;
  }
  getGameIdForRewardCategoryId(rewardCategoryId) {
    let path = this.pathForId_(rewardCategoryId);
    return this.source.get(path.slice(0, 2)).id;
  }
  getGameIdForPlayerId(playerId, allowNotFound) {
    let path = this.pathForId_(playerId, allowNotFound, ["games"]);
    if (path)
      return this.source.get(path.slice(0, 2)).id;
    else
      return null;
  }
  getGameIdForChatRoomId(chatRoomId) {
    let path = this.pathForId_(chatRoomId);
    return this.source.get(path.slice(0, 2)).id;
  }


  idExists(id, allowNotFound) {
    return this.objForId_(id, allowNotFound);
  }
  objForId_(id, allowNotFound) {
    assert(id);
    let result = this.objForIdInner_(this.source.get([]), id);
    if (!allowNotFound)
      assert(result);
    return result;
  }
  objForIdInner_(obj, id) {
    assert(typeof obj == 'object');
    if (obj) {
      if (obj.id == id)
        return obj;
      for (var key in obj) {
        if (typeof obj[key] == 'object') {
          let found = this.objForIdInner_(obj[key], id);
          if (found)
            return found;
        }
      }
    }
    return null;
  }
  pathForId_(id, allowNotFound, startPath) {
    startPath = startPath || [];
    assert(id);
    let result = this.pathForIdInner_(startPath, this.source.get(startPath), id);
    if (!allowNotFound)
      assert(result);
    return result;
  }
  pathForIdInner_(path, obj, id) {
    assert(typeof obj == 'object');
    if (obj) {
      if (obj.id == id)
        return path;
      for (var key in obj) {
        if (typeof obj[key] == 'object') {
          let foundPath = this.pathForIdInner_(path.concat([key]), obj[key], id);
          if (foundPath)
            return foundPath;
        }
      }
    }
    return null;
  }

  getPlayer(gameId, playerId) {
    return this.get(["gamesById", gameId, "playersById", playerId]);
  }

  isConsistent() {
    for (var gunId in this.get(["gunsById"])) {
      if (!this.isGunConsistent(gunId)) {
        return false;
      }
    }
    return true;
  }

  isGunConsistent(gunId) {
    let gun = this.get(["gunsById", gunId]);
    if (gun.playerId) {
      if (!this.idExists(gun.playerId, true))
        return false;
      let gameId = this.getGameIdForPlayerId(gun.playerId, true);
      if (!gameId)
        return false;
      if (!this.get(["gamesById", gameId, "playersById", gun.playerId]))
        return false;
    }
    return true;
  }

  isGameConsistent(gameId) {
    return true;
  }

  isPlayerConsistent(gameId, playerId) {
    if (!this.get(["gamesById", gameId]))
      return false;
    let player = this.get(["gamesById", gameId, "playersById", playerId]);
    if (!player)
      return false;
    let userId = player.userId;
    if (!this.get(["usersById", userId]))
      return false;
    return true;
  }

  isAdminConsistent(gameId, adminId) {
    let admin = this.get(["gamesById", gameId, "adminsById", adminId]);
    let userId = admin.userId;
    if (!this.get(["usersById", userId]))
      return false;
    if (!this.get(["gamesById", gameId]))
      return false;
    return true;
  }
}