const { ccclass, property, menu } = cc._decorator;

/**
 * 适配iPhoneX等类型的刘海屏幕
 * @条件：目标节点有配置cc.Widget组件，且目标组件是按照top属性对其;
 */
@ccclass
@menu('comp/AdaptedTopOfIPhoneX')
export default class AdaptedTopOfIPhoneX extends cc.Component {
  @property(cc.Float) offset = 50;
  onLoad() {
    if (this.aspectRatio > 2) {
      let comp = this.node.getComponent(cc.Widget);
      comp.top += this.offset;
    }
  }

  get aspectRatio() {
    const size = cc.view.getFrameSize();
    return size.height / size.width;
  }
}
