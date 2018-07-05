/** 通过canvas内容创建的临时图片对象 */
interface TempFileData {
  x?: number | any,	//	// 截取 canvas 的左上角横坐标
  y?: number | any,	// 截取 canvas 的左上角纵坐标
  width?: number | any,	// 截取 canvas 的宽度
  height?: number | any,	// 截取 canvas 的高度
  destWidth?: number | any,	// 目标文件的宽度，会将截取的部分拉伸或压缩至该数值
  destHeight?: number | any, // 目标文件的高度，会将截取的部分拉伸或压缩至该数值
  fileType?: string | any,	// 目标文件的类型
  quality?: number | any, // jpg图片的质量，仅当 fileType 为 jpg 时有效。取值范围为 0.0（最低）- 1.0（最高），不含 0。不在范围内时当作 1.0
}

/** 游戏圈按钮icon的值  */
enum GAME_CLUB_BUTTON_ICON {
  GREEN = 'green',
  WHITE = 'white',
  DARK = 'dark',
  LIGHT = 'light'
};
/** 默认的游戏圈icon设置  */
const DEFAULT_GAME_CLUB_BUTTON = {
  icon: GAME_CLUB_BUTTON_ICON.WHITE,
  style: {
    left: 10,
    top: 70,
    width: 40,
    height: 40
  }
}

class WxTools {
  static GAME_CLUB_BUTTON_ICON = GAME_CLUB_BUTTON_ICON;
  static get isWxPlatFrom() {
    return cc.sys.platform === cc.sys.WECHAT_GAME;
  }

  /**
   * 转发相关API
   * https://developers.weixin.qq.com/minigame/dev/tutorial/open-ability/share.html
   * */
  /** 显示转发菜单 */
  static showShareMenu() {
    if (!this.isWxPlatFrom) return;
    wx.showShareMenu();
  }
  /** 隐藏转发菜单 */
  static hideShareMenu() {
    if (!this.isWxPlatFrom) return;
    wx.hideShareMenu();
  }
  /** 监听被动转发 */
  static onShareAppMessage(title: string | any = '', imageUrl: string = '') {
    if (!this.isWxPlatFrom) return;
    wx.onShareAppMessage(function () {
      return {
        title: title,
        imageUrl: imageUrl
      }
    });
  }
  /** 主动转发 */
  static shareAppMessage(title: string | any = '', imageUrl: string = '') {
    if (!this.isWxPlatFrom) return;
    wx.shareAppMessage({
      title: title,
      imageUrl: imageUrl
    });
  }
  /** 修改转发属性：withShareTicket 模式 */
  static updateShareMenu(bloor: boolean = true) {
    if (!this.isWxPlatFrom) return;
    // 设置 withShareTicket: true
    wx.updateShareMenu({
      withShareTicket: bloor
    })
  }

  /** 获取canvas截图临时文件路径 */
  static async canvasToTempFileSync(obj: TempFileData): Promise<any> {
    if (!this.isWxPlatFrom) return '';
    const canvas = cc.game.canvas;
    return new Promise((resolve) => {
      canvas.toTempFilePath({
        x: obj.x || 0,
        y: obj.y || 0,
        width: obj.width || 400,
        height: obj.height || 500,
        destWidth: 400,
        destHeight: 500,
        success: res => resolve(res.tempFilePath)
      })
    }).then(results => results);
  }

  /** 获取精灵的纹理路径: 目前只用于微信小游戏 */
  static getTextureUrlAtWechat(spriteFrame: cc.SpriteFrame) {
    const src = spriteFrame._texture._image.src;
    const filePath = src.replace(window.location.origin + '/game/', '');
    return filePath;
  }

  /**
   * 游戏圈
   * https://developers.weixin.qq.com/minigame/dev/tutorial/open-ability/game-club.html
   */
  /** 创建打开游戏圈的按钮 */
  static createGameClubButton(obj = DEFAULT_GAME_CLUB_BUTTON) {
    if (!this.isWxPlatFrom) return null;
    return wx.createGameClubButton(obj);
  }

  /**
   * 广告
   * https://developers.weixin.qq.com/minigame/dev/tutorial/ad/banner-ad.html
   */
  /** 视频广告 */
  static createRewardedVideoAd() {
    // return wx.createRewardedVideoAd()
  }
  /** Banner广告 */
  static createBannerAd() {
    // return  wx.createBannerAd();
  }

  /**
   * 用户授权
   * https://developers.weixin.qq.com/minigame/dev/tutorial/open-ability/authorize.html
   */


  /**
   * 关系链数据
   * https://developers.weixin.qq.com/minigame/dev/tutorial/open-ability/open-data.html
   */
  /** 获取当前用户也玩该小游戏的好友的用户数据 */
  static getFriendCloudStorage() {
    if (!this.isWxPlatFrom) return null;
    wx.getFriendCloudStorage();
  }
  /** 获取当前用户在某个群中也玩该小游戏的成员的用户数据 */
  static getGroupCloudStorage() {
    if (!this.isWxPlatFrom) return null;
    wx.getGroupCloudStorage();
  }
  /** 获取当前用户的托管数据 */
  static getUserCloudStorage() {
    if (!this.isWxPlatFrom) return null;
    wx.getUserCloudStorage()
  }
  /** 将当前用户的游戏数据托管在微信后台 */
  static setUserCloudStorage(data) {
    if (!this.isWxPlatFrom) return null;
    wx.setUserCloudStorage(data);
  }
  /** 删除用户托管数据中指定字段的数据  */
  static removeUserCloudStorage() {
    if (!this.isWxPlatFrom) return null;
    wx.removeUserCloudStorage();
  }
  /** sharedCanvas 是主域和开放数据域都可以访问的一个离屏画布 */
  static getSharedCanvas() {
    if (!this.isWxPlatFrom) return null;
    return wx.getSharedCanvas();
  }
  static createCanvas() {
    if (!this.isWxPlatFrom) return null;
    return wx.createCanvas();
  }
  static getOpenDataContext() {
    if (!this.isWxPlatFrom) return null;
    return wx.getOpenDataContext();
  }
  /** 监听从主域发来的消息 */
  static onMessage() {
    if (!this.isWxPlatFrom) return null;
    wx.onMessage();
  }
  /** 发消息给子域 */
  static postMessage(data) {
    if (!this.isWxPlatFrom) return null;
    wx.postMessage(data);
  }

}

window.WxTools = WxTools;
export default WxTools;