class PopMgr {
    private pool = null; //节点对象池1:预制体冒泡
    prefab: cc.Prefab = null;
    private _isInited = false;//是否初始化
    private LIMIT = 2; //初始个数
    private DEFAULT_COLOR = new cc.Color().fromHEX('#FFFFFF'); //默认字体颜色

    init() {
        this.pool = new cc.NodePool();
        cc.loader.loadRes('prefab/Pop', cc.Prefab, (err, prefab) => {
            if (err) return console.error(err);
            const LIMIT = this.LIMIT;
            this.prefab = prefab;
            for (let i = 0; i < LIMIT; i++) {
                const node = cc.instantiate(this.prefab);
                this.pool.put(node);
            }
            this._isInited = true;
        });
    }

    show(str, data: any = {}) {
        const node = data.isNormalNode ? this.createPopLabel(str) : this.createPop(str, data);
        this.runPop(node, data.time || 1.5, !data.isNormalNode);
    }

    getPop() {
        let node = this.pool.get();
        if (!node) {// 如果没有空闲对象，也就是对象池中备用对象不够时，我们就用 cc.instantiate 重新创建
            node = cc.instantiate(this.prefab);
        }
        return node;
    }

    putPop(node) {
        if (this.pool.size() <= this.LIMIT) {
            this.pool.put(node);
        } else {
            node.destroy();
        }
        
    }

    createPop(str, data) {
        const scene = cc.director.getScene();
        const popNode = this.getPop();
        popNode.y = data.y || 100;
        popNode.position = cc.v2(cc.winSize.width / 2, cc.winSize.height / 2);
        scene.addChild(popNode, 1000);

        let labelNode = popNode.getChildByName('label');
        labelNode.color = data.color || this.DEFAULT_COLOR;
        var labelComp = labelNode.getComponent(cc.Label);
        labelComp.horizontalAlign = data.algin || cc.Label.HorizontalAlign.CENTER;
        labelComp.fontSize = data.fontSize || 36;
        labelComp.string = str;
        labelComp.overflow = cc.Label.Overflow.RESIZE_HEIGHT;
        return popNode;
    }

    createPopLabel(str) {
        var scene = cc.director.getScene();
        var label = new cc.Node('pop');
        label.color = cc.Color.YELLOW;
        label.y = 100;
        label.width = 0.9 * scene.width;
        label.height = 150;
        label.x = cc.winSize.width / 2;
        label.y = cc.winSize.height / 2;
        scene.addChild(label, 1000);
        var labelComp = label.addComponent(cc.Label);
        labelComp.horizontalAlign = cc.Label.HorizontalAlign.CENTER;
        labelComp.fontSize = 36;
        labelComp.string = str;
        labelComp.overflow = cc.Label.Overflow.NONE;
        return label;
    }

    runPop(node, time, isPoolNode) {
        node.stopAllActions();
        var act = cc.tween(node)
            .set({ opacity: 0 })
            .to(0.5, { opacity: 255 })
            .delay(time)
            .to(0.5, { opacity: 0, y: node.y + 120 }, {easing: 'sineOut'})
            .call(() => { isPoolNode ? this.putPop(node) : node.destroy() });
        act.start();
    }

    clear() {
        this.pool.clear();
    }
}

let popMgr = new PopMgr();
export default popMgr;