import { sys } from "..";

/**
 * 适配iPhoneX等类型的刘海屏幕
 * @条件：目标节点有配置cc.Widget组件，且目标组件是按照top属性对其;
 */
const { ccclass, property } = cc._decorator;
@ccclass
export default class AdaptedTopOfIPhoneX extends cc.Component {
  @property(Number) offset = 50;
  onLoad() {
    if (sys.aspectRatio > 2) {
      let comp = this.node.getComponent(cc.Widget);
      comp.top += this.offset;
    }
  }
}
