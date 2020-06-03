const { ccclass, property, menu } = cc._decorator;

const ACT_LIST = cc.Enum({
  /** 放大进入 */
  SCALE_IN: 1,
  /** 缩小退出 */
  SCALE_OUT: 2,
  /** 左侧飞入 */
  LEFT_IN: 3,
  /** 左侧飞出 */
  LEFT_OUT: 4,
  /** 右侧飞入 */
  RIGHT_IN: 5,
  /** 右侧飞出 */
  RIGHT_OUT: 6,
});

/**
 * 弹窗组件: 绑定在需要弹窗的根节点
 * 打开时start里面执行弹出动画，关闭时用按钮绑定关闭动画
 */
@ccclass
@menu('comp/PanelComponent')
export default class PanelComponent extends cc.Component {
  @property({
    type: cc.Node,
    tooltip: '需要做动画的目标节点,没有绑定的话默认为当前节点'
  }) target: cc.Node = null; //目标节点
  @property({
    tooltip: '是否出现时自动缩放'
  }) autoStart: Boolean = false; // 出现自动缩放
  @property({
    tooltip: '是否自动销毁'
  }) autoDestroy: Boolean = false; //关闭动画完成后是否自动销毁
  @property({
    type: cc.Component.EventHandler,
    tooltip: '打开回调',
  }) openCb: Array<cc.Component.EventHandler> = [];
  @property({
    type: cc.Component.EventHandler,
    tooltip: '关闭回调',
  }) closeCb: Array<cc.Component.EventHandler> = [];

  @property({
    type: ACT_LIST,
    tooltip: '开始动画类型',
  }) openAct: number = 1;
  @property({
    type: ACT_LIST,
    tooltip: '关闭动画类型',
  }) closeAct: number = 2;

  _openCb: Function = null;
  _closeCb: Function = null;

  onLoad() {
    //没有target时取当前节点
    if (!cc.isValid(this.target)) {
      this.target = this.node;
    }
    //自动播放打开动画的，需要初始化数值(主要是widget控件引起的异常)
    if (this.autoStart) {
      this.init();
    }
    this.addListen();
  }

  // onDisable() {
  //   this.rmListen();
  // }

  onDestroy() {
    this.rmListen();
  }

  start() {
    if (this.autoStart) {
      this.runOpen();
    }
  }

  init() {
    const widget = this.target.getComponent(cc.Widget);
    const posx = this.node.x;
    // console.log(cc.winSize.width);
    const actIdx = this.openAct;
    if (actIdx == ACT_LIST.SCALE_IN) {
      this.node.scale = 0.1;
      return;
    }
    //
    // if ((widget) && (widget.isAbsoluteLeft || widget.isAbsoluteRight)) { console.error('目标节点上的Widget控件，配置了left或者right,可能会引起位置异常，请更换start的动作类型，或者去掉widget的left和right的属性设置') }
    if (actIdx == ACT_LIST.LEFT_IN) {
      this.node.x = posx + cc.winSize.width / 2;
    } else if (actIdx == ACT_LIST.RIGHT_IN) {
      this.node.x = posx - cc.winSize.width / 2;
    }
    if (!widget) return;
    if (widget.isAlignLeft || widget.isAlignRight || widget.isAlignHorizontalCenter) { 
      console.error('开始动画选择的是左右飞入，同时目标节点存在Widget控件，并且配置了left或right或horizontalCenter,可能会引起位置异常，请更换的开始动画类型，或者Widget相关的属性设置');
    }
  }

  addListen() {
    this.node.on('openPanel', this.openPanel, this);
    this.node.on('closePanel', this.closePanel, this);
  }

  rmListen() {
    this.node.off('openPanel', this.openPanel, this);
    this.node.off('closePanel', this.closePanel, this);
  }

  openPanel(openCb) {
    if (openCb instanceof cc.Event.EventCustom) {
      openCb = openCb.getUserData();
    }
    this._openCb = openCb;
    this.runOpen();
  }
  closePanel(closeCb) {
    if (closeCb instanceof cc.Event.EventCustom) {
      closeCb = closeCb.getUserData();
    }
    this._closeCb = closeCb;
    this.runClose();
  }

  runOpen() {
    this.target.stopAllActions();
    let act = this.getAct(this.openAct);
    act.target(this.target)
      .call(() => {
        this._openCb && this._openCb();
        cc.Component.EventHandler.emitEvents(this.openCb);
      })
      .start();
  }
  runClose() {
    this.target.stopAllActions();
    let act = this.getAct(this.closeAct);
    act.target(this.target)
      .call(() => {
        this._closeCb && this._closeCb();
        cc.Component.EventHandler.emitEvents(this.closeCb);
        if (this.autoDestroy) {
          this.node.destroy();
        }
      })
      .start();
  }

  /** 获取动作 */
  getAct(idx): cc.Tween {
    const actName = ACT_LIST[idx];
    const LEFT_IN = cc.tween()
      .set({ x: -cc.winSize.width })
      .to(0.15, { x: 0 }, { easing: 'sineIn' })
    const LEFT_OUT = cc.tween()
      .to(0.15, { x: -cc.winSize.width }, { easing: 'sineOut' })
    const RIGHT_IN = cc.tween()
      .set({ x: cc.winSize.width })
      .to(0.15, { x: 0 }, { easing: 'sineIn' })
    const RIGHT_OUT = cc.tween()
      .to(0.15, { x: cc.winSize.width }, { easing: 'sineOut' })
    const SCALE_IN = cc.tween()
      .set({ scale: 0.1 })
      .to(0.1, { scale: 1 })
    const SCALE_OUT = cc.tween()
      .to(0.1, { scale: 0.1 })
    const list = {
      LEFT_IN,
      LEFT_OUT,
      RIGHT_IN,
      RIGHT_OUT,
      SCALE_IN,
      SCALE_OUT,
    }
    return list[actName];
  }

}
