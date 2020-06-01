import logger from "../libs/logger";
import addPerFrame from "../libs/addPerFrame";

const { ccclass, property, menu, requireComponent } = cc._decorator;

/**
 * 
 * 请不要在content节点上添加cc.Layout组件
 */
@ccclass
@requireComponent(cc.ScrollView)
@menu('extra/ScrollViewPro')
export default class ScrollViewPro extends cc.Component {
    @property(cc.ScrollView) sv: cc.ScrollView = null;
    @property(cc.Prefab) ItemPrefab: cc.Prefab = null;
    view: cc.Node = null;
    content: cc.Node = null;
    @property(cc.Float) space = 0;
    /** 启用逐帧添加 */
    @property({ tooltip: '是否启用逐帧添加,默认true' })
    enableAddPerFrame: Boolean = true;

    direction: number = 0; //滑动方向 0-vertical 1-horizon 2-both
    noneed = false; // 是否需要检测
    _noUpdateUI = false; //没有刷新UI

    data = {
        arr: [],
        viewLen: 0, // 可看到最多的子节点数量
        space: 0,  // 间隔
        lastY: 0,  // 
        maxH: 0, // 最大边界
    }
    onLoad() {
        if (!cc.isValid(this.sv)) {
            this.sv = this.node.getComponent(cc.ScrollView);
        }
        this.view = this.sv.node.getChildByName('view');
        this.content = this.sv.content;
        //禁用layout组件
        const contentLayoutComp = this.content.getComponent(cc.Layout)
        if (contentLayoutComp) {
            cc.error('使用ScrollViewPro组件请不要在content节点上添加cc.Layout组件,会引起位置错乱!');
            contentLayoutComp.enabled = false;
        }
    }

    onEnable() {
        this.node.on("scrolling", this.onScrolling, this);
        this.node.on("initScrollViewPro", this.initScrollViewPro, this);
    }

    onDisable() {
        this.node.off("scrolling", this.onScrolling, this);
        this.node.off("initScrollViewPro", this.initScrollViewPro, this);
    }
    onScrolling() {
        //不需要检测
        if (this.noneed) return;
        //预显示数据的总数量
        let dataLen = this.data.arr.length;

        let isDown = this.content.y > this.data.lastY;
        const maxH = this.data.maxH;

        var arr = this.content.children;
        const len = arr.length;
        const dataArr = this.data.arr;
        for (let i = 0; i < len; i++) {
            const node = arr[i];

            //item坐标转换到对应view节点的坐标 y坐标需要减去一半item的高度...具体看你item的锚点设置
            let pos = node.getPosition();
            pos = this.content.convertToWorldSpaceAR(pos);
            pos.y -= this.view.height / 2;
            pos = this.view.convertToNodeSpaceAR(pos)

            if (isDown) {
                //判断当前item的坐标是否大于顶部最大Y
                if (pos.y > maxH) {
                    //计算新的itmeid 
                    //比如一共13个item item的索引就是0-12 那么第0个item超过y坐标之后 就需要显示第13个item
                    //那么就是将当前id + 当前item的数量即可
                    let newId = node['cellId'] + len;
                    if (newId >= dataLen) return; //如果item已经显示完毕了就不需要刷新了
                    node['cellId'] = newId; //保存itemid
                    node.y = node.y - len * (node.height + this.data.space); //计算item的新的Y坐标 也就是当前y减去所有item加起来的高度
                    node.emit('refreshData', newId, dataArr[newId]); //刷新item内容 
                }
            } else {
                if (pos.y < -maxH) {
                    let newId = node['cellId'] - len;
                    if (newId < 0) return;
                    node['cellId'] = newId;
                    node.y = node.y + len * (node.height + this.data.space);
                    node.emit('refreshData', newId, dataArr[newId]);
                }
            }
        }
        // 记录content的坐标，用于判断滑动方向
        this.data.lastY = this.content.y;
    }

    start() {
        logger.log('==> start');
        if (this._noUpdateUI) {
            this._noUpdateUI = false;
            this.initUI();
        }
    }

    initScrollViewPro(arr, len?) {
        this.initData(arr, len);
    }

    initData(arr, viewLen = 0) {
        logger.log('==> initData');
        this.data.arr = arr || [];
        this.data.viewLen = viewLen;
        this.data.space = this.space;
        // 还没加载，不刷新UI
        if (this._isOnLoadCalled == 0) {
            this._noUpdateUI = true;
            return;
        }
        this._noUpdateUI = false;
        this.initUI();
    }

    initUI() {
        this.content.destroyAllChildren();
        // 副本节点
        const bakeNode = cc.instantiate(this.ItemPrefab);

        // 计算可见区域需要的节点数量
        const viewNode = this.content.parent;
        const rect = viewNode.getBoundingBox();
        const height = rect.height;
        const childHeight = bakeNode.height;
        this.data.viewLen = childHeight ? Math.ceil(height / childHeight) : 5;
        const len = this.data.viewLen;
        
        // 初始创建数量
        let initLen = 3 * len;
        if (initLen > this.data.arr.length) {
            initLen = this.data.arr.length;
            this.noneed = true;
        }
        this.noneed = false;
        logger.log(`ScrollViewPro viewLen = ${this.data.viewLen} , initLen = ${initLen}`);

        // 缓冲边界
        this.data.maxH = 1.5 * len * childHeight;

        if (this.enableAddPerFrame) {
            // 初始化节点(未优化)
            for (let idx = 0; idx < initLen; idx++) {
                this.addSingleItem(bakeNode, idx);
            }
        } else {
            // 初始化节点(逐帧生成)
            addPerFrame.framingLoad(initLen, (idx) => {
                this.addSingleItem(bakeNode, idx);
            });
        }

        // 设定content长度为所有data的长度
        this.content.setContentSize(cc.size(bakeNode.width, this.data.arr.length * (this.data.space + childHeight)));
        this.data.lastY = this.content.y;
    }

    /** 添加单个item */
    addSingleItem(bakeNode, idx) {
        const node = cc.instantiate(bakeNode);
        this.content.addChild(node);
        node.x = 0;
        node.y = -(idx * (node.height + this.data.space) + node.height / 2);
        node['cellId'] = idx;
        node.emit('addToContent', idx, this.data.arr[idx]);
    }

}