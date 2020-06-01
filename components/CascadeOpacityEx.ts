const { ccclass, property, menu } = cc._decorator;

/**
 * 控制子节点是否跟随父节点的透明度
 */
@ccclass
@menu('comp/CascadeOpacityEx')
export default class CascadeOpacityEx extends cc.Component {
  // 是否影响子节点的透明度
  @property(Boolean) cascadeOpacityEnabled = false;
  onLoad() {
    this.node.setCascadeOpacityEnabled(this.cascadeOpacityEnabled);
  }
}
