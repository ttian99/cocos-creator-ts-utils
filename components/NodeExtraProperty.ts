const { ccclass, property, menu } = cc._decorator;
@ccclass
@menu('comp/NodeExtraProperty')
export default class NodeExtraProperty extends cc.Component {
    _zIndex: number = 0;
    get zIndex() {
        return this._zIndex;
    }
    @property({ type: cc.Integer, step: 1 })
    set zIndex(int) {
        this._zIndex = int;
        this.applyZIndex();
    }

    applyZIndex() {
        this.node.zIndex = this.zIndex;
    }
}
