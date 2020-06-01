const { ccclass, property, menu } = cc._decorator;

/**
 * 水平对齐方式
 */
enum H_ALIGN {
    LEFT,
    MIDDLE,
    RIGHT,
}

/**
 * 垂直对齐方式
 */
enum V_ALIGN {
    TOP,
    CENTER,
    BOTTOM,
}

/**
 * 对齐绑定组件  
 * 由于cc.Weiget默认只能绑定父节点，对于同级节点或者跨级节点无法对齐
 */
@ccclass
@menu('comp/AutoWidget')
export default class AutoWidget extends cc.Component {
    H_ALIGN = H_ALIGN;
    V_ALIGN = V_ALIGN;
    @property(cc.Node) target: cc.Node = null;
    @property({
        type: cc.Enum(H_ALIGN)
    }) hAlign: H_ALIGN = H_ALIGN.LEFT;
    @property({
        type: cc.Enum(V_ALIGN)
    }) vAlign: V_ALIGN = V_ALIGN.TOP;
    /** 水平偏移量 */
    @property({
        type: cc.Float,
        tooltip: '水平偏移量'
    }) offX: number = 0; 
    /** 垂直偏移量 */
    @property({
        type: cc.Float,
        tooltip: '垂直偏移量'
    }) offY: number = 0;

    onLoad() {

    }

    start() {
        this.render();
    }

    onEnable() {
        this.target.on(cc.Node.EventType.SIZE_CHANGED, this.onChange, this);
        // this.node.on(cc.Node.EventType.POSITION_CHANGED, this.updateOffset, this);
    }

    onDisable() {
        this.target.off(cc.Node.EventType.SIZE_CHANGED, this.onChange, this);
        // this.node.off(cc.Node.EventType.POSITION_CHANGED, this.updateOffset, this);
    }

    updateOffsize(e, data) {
        console.log(e, data);
        // console.log('==============================');

    }

    getPositionInTarget() {
        if (!cc.isValid(this.target)) return;
        let pos = this.node.position;
        pos = this.node.parent.convertToWorldSpaceAR(pos);
        pos = this.target.convertToNodeSpaceAR(pos);
        const rect = this.target.getBoundingBox();

    }

    onChange() {
        this.render();
    }

    render() {
        let pos = this.getPosInTarget();
        pos = this.target.convertToWorldSpaceAR(pos);
        pos = this.node.parent.convertToNodeSpaceAR(pos);
        this.node.setPosition(pos);
    }

    /** 获取在目标节点内的坐标 */
    getPosInTarget(): cc.Vec2 {
        const size = this.target.getContentSize();
        const x = (this.hAlign - 1) * size.width / 2;
        const y = (1 - this.vAlign) * size.height / 2;
        const signX = this.vAlign - 1;
        const signY = 1 - this.vAlign;
        return cc.v2(x + signX * this.offX, y + signY * this.offY);
    }
}