import logger from "../libs/logger";

const { ccclass, property, menu, requireComponent } = cc._decorator;
/**
 * scrollview的自定义事件
 */
const ExtraEvent = {
    /** 子节点进入scrollview的可视区域 */
    ENTER_SCROLL_VIEW: 'enterScrollView',
    /** 子节点离开scrollview的可视区域 */
    EXIT_SCROLL_VIEW: 'exitScrollView'
}
/**
 * ScrollViewEx
 */
@ccclass
@requireComponent(cc.ScrollView)
@menu('extra/ScrollViewEx')
export default class ScrollViewEx extends cc.Component {
    @property({
        tooltip: CC_DEV && '是否开启子节点进入退出scrollview可视区域检测：默认关闭；开启后，每次滑动事件都会触发检测，注意性能，可以在子节点监听enterScrollView和exitScrollView事件进行对应操作'
    })
    enableEnterExitCheck = false;

    @property(cc.ScrollView) sv: cc.ScrollView = null;
    @property(cc.Node) content: cc.Node = null;

    onLoad() {
        if (!cc.isValid(this.sv)) {
            this.sv = this.node.getComponent(cc.ScrollView);
        }
        if (!cc.isValid(this.content)) {
            this.content = this.sv.content;
        }
    }

    onEnable() {
        this.sv.node.on("scrolling", this._onScrollingDrawCallOpt, this);
        this.sv.node.on("checkEnterExit", this.checkEnterExit, this);
    }

    onDisable() {
        this.sv.node.off("scrolling", this._onScrollingDrawCallOpt, this);
        this.sv.node.off("checkEnterExit", this.checkEnterExit, this);
    }

    private _onScrollingDrawCallOpt() {
        if (!this.enableEnterExitCheck) return;
        if (this.content.childrenCount == 0) {
            return;
        }
        // 上文提及到的碰撞检测代码
        // ...
        this.check();
    }

    /** 获取scrollview的可见区域 */
    private _getSvBBoxRect() {
        // const scrollView = this.scroll;
        const node = this.sv.node;
        const { x, y, width, height, anchorX, anchorY } = node;
        // 获取 ScrollView Node 的左下角坐标在世界坐标系中的坐标
        let leftBottomPoint = cc.v2(x - anchorX * width, y - anchorY * height);
        leftBottomPoint = node.parent.convertToWorldSpaceAR(leftBottomPoint);
        // 求出 ScrollView 可视区域在世界坐标系中的矩形（碰撞盒）
        return cc.rect(leftBottomPoint.x, leftBottomPoint.y, width, height)
    }

    /** 检测子节点是否与scrollView的可见区域碰撞 */
    check() {
        const svBBoxRect = this._getSvBBoxRect();
        // 遍历 ScrollView Content 内容节点的子节点
        this.content.children.forEach((childNode: cc.Node) => {
            this.isIntersects(childNode, svBBoxRect);
        });
    }

    /**
     *  对每个子节点的包围盒做和 ScrollView 可视区域包围盒做碰撞判断
     *  如果相交了，那么就显示，否则就隐藏
     */
    isIntersects(childNode: cc.Node, svBBoxRect: cc.Rect) {
        if (childNode.getBoundingBoxToWorld().intersects(svBBoxRect)) {
            childNode.emit('enterScrollView');
        } else {
            childNode.emit('exitScrollView');
        }
    }

    checkEnterExit(targetNode) {
        const svBBoxRect = this._getSvBBoxRect();
        this.isIntersects(targetNode, svBBoxRect);
    }

}
