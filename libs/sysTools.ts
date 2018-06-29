class SysTools {
  // 可用于在下一帧刷新时调用
  static nextTick(cb: Function) {
    setTimeout(cb, 0);
  }
  // 开启或关闭fps
  static showFPS(enabled: boolean = true) {
    cc.director.setDisplayStats(enabled);
    const { config, CONFIG_KEY } = cc.game;
    config[CONFIG_KEY.showFPS] = enabled;
  }
  // 取消Canvas模式下矩形优化,防止sprite黑框出现
  static disableDirtyRegion() {
    if (cc._renderType === cc.game.RENDER_TYPE_CANVAS) {
      cc._RendererInSG.enableDirtyRegion(false);
    }
  }
  // 关闭自动全屏功能(PC端的QQ浏览器点击输入框会触发自动全屏)
  static disableAutoFullScreen() {
    cc.view.enableAutoFullScreen(false);
  }
  /**
   * 测试浏览器是否支持命令
   * 例如：document.queryCommandSupported('copy');
   */
  static caniuse(cmd: string) {
    document.queryCommandSupported(cmd);
  }
  // 获取渲染模式 0-canvas 1-webgl
  static getRenderMode() {
    return cc._renderType;
  }

  /**判断是否为iPhoneX */
  static get isIphoneXDevices() {
    const size = cc.view.getFrameSize();
    console.log(size);
    return (size.width == 2436 && size.height == 1125) || (size.width == 1125 && size.height == 2436);
  }
}

export default SysTools;