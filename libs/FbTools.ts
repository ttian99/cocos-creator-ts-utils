const DEFAULT_BASE64_IMG = 'data:image/jpg;base64,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';
const DEFAULT_UPDATE_ASYNC_CONFIG = {
  action: 'CUSTOM',
  cta: 'Play',
  image: DEFAULT_BASE64_IMG,
  text: {
    // default: 'Edgar played their move',
    default: 'Monkey was washing under the table! haha',
    localizations: {
      en_US: 'Edgar played their move',
      es_LA: '\u00A1Edgar jug\u00F3 su jugada!'
    }
  },
  template: 'play_turn',
  data: { myReplayData: '...' },
  strategy: 'IMMEDIATE',
  notification: 'PUSH'
}

interface sharePayLoad {
  itent?: string,
  image?: string,
  text?: string,
  data?: object,
}

/**
 * facebook instant game 工具类
 * instantgame小游戏文档：https://developers.facebook.com/docs/games/instant-games
 * SDK文档: https://developers.facebook.com/docs/games/instant-games/sdk/fbinstant6.2
 */
class FbTools {
  defaultImg: string = null;
  constructor(img) {
    this.defaultImg = img || DEFAULT_BASE64_IMG;
  }
  /** 记录事件 */
  static logEvent(eventName: string, valueToSum: number, param?: Object) {
    return FBInstant.logEvent(eventName, valueToSum, param);
  }
  /** 暂停 */
  static onPause(cb) {
    FBInstant.onPause(function () {
      console.log('Pause event was triggered!');
      cb && cb();
    });
  }

  /** 获取contextId */
  static getContextId() {
    return FBInstant.contex.getID();
  }

  /** 拉好友一起玩
   * @description ContextFilter类型: ("NEW_CONTEXT_ONLY" | "INCLUDE_EXISTING_CHALLENGES" | "NEW_PLAYERS_ONLY")
  */
  static async inviteFriend(successCb, errorCb) {
    try {
      await FBInstant.context.chooseAsync(); // 初始化游戏环境
      await FBInstant.updateAsync(DEFAULT_UPDATE_ASYNC_CONFIG); // 更新游戏环境
      successCb && successCb();
    } catch (error) {
      errorCb && errorCb(error);
    }
  }

  /** 分享 */
  static async shareAsync(opts: sharePayLoad) {
    return FBInstant.shareAsync({
      intent: opts.itent || 'SHARE',
      image: opts.image,
      text: opts.text || '',
      data: opts.data,
    });
  }
  /** 加载视频广告 */
  static async getRewardedVideoAsync(placementId) {
    const preloadedRewardedVideo = await FBInstant.getRewardedVideoAsync(placementId);
    await preloadedRewardedVideo.loadAsync();
    return preloadedRewardedVideo;
  }
  /** 展示视频广告 */
  static async showLoadedRewardedVideo(preloadedRewardedVideo) {
    return preloadedRewardedVideo.showAsync();
  }
  /** 获取数据 */
  static getDataAsync(keyArr) {
    return FBInstant.player.getDataAsync(keyArr);
  }
  /** 设置数据
   * isFlush 表示立刻存储刷新
   * 详细见FBInstant.player.flushDataAsync: https://developers.facebook.com/docs/games/instant-games/sdk/fbinstant6.2
  */
  static setDataAsync(data, cb, isFlush = false) {
    return FBInstant.player.setDataAsync(data).then(FBInstant.player.flushDataAsync);
  }
  /** 获取统计数据 */
  static getStatsAsync(keysArr, cb) {
    return FBInstant.player.getStatsAsync(keysArr);
  }
  /** 设置统计数据 */
  static setStatsAsync(data, cb) {
    return FBInstant.player.setStatsAsync(data);
  }
  /** 设置增量统计数据 */
  static incrementStatsAsync(data) {
    return FBInstant.player.setStatsAsync(data);
  }

  /** 添加到主屏幕 */
  static async canCreateShortcutAsync(successFunc?, failedFunc?) {
    try {
      const canCreateShortcut = await FBInstant.canCreateShortcutAsync();
      if (canCreateShortcut) {
        await FBInstant.createShortcutAsync();
        successFunc && successFunc();
      } else {
        failedFunc && failedFunc();
      }
    } catch (err) {
      failedFunc && failedFunc(err);
    }
  }

  /** 获取全球排行榜 */
  static async getGlobalRank(rankName: string, isFriend: boolean = false, count: number = 100, offset: number = 0) {
    try {
      const leaderboard = await FBInstant.getLeaderboardAsync(rankName);
      let entries = [];
      if (isFriend) {
        entries = await leaderboard.getConnectedPlayerEntriesAsync(count, offset);
      } else {
        entries = await leaderboard.getEntriesAsync(count, offset);
      }
      return entries;
    } catch (error) {
      cc.error(error);
      return [];
    }
  }
  /** 获取个人排行数据 */
  static async getSelfRankData(rankName: string) {
    try {
      const leaderboard = await FBInstant.getLeaderboardAsync(rankName);
      const entry = await leaderboard.getPlayerEntryAsync();
      return entry;
    } catch (error) {
      cc.error(error);
      return null;
    }
  }
  /** 上传排行榜数据 */
  static async setRankData(rankName: string, data: any) {
    try {
      const leaderboard = await FBInstant.getLeaderboardAsync(rankName);
      const entry = await leaderboard.setScoreAsync(data);
      return entry;
    } catch (error) {
      cc.error(error);
      return null;
    }
  }
}

export default FbTools;