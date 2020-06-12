
/** 冒泡参数 */
interface PopParam {
    /** 指定冒泡父节点: 默认使用场景根节点 */
    parent?: cc.Node,
    /** 指定冒泡类型: 0-表示默认冒泡使用系统默认字体，1-表示使用自定义冒泡使用预制体 (默认为0) */
    type?: number,
    /** 冒泡展示时间(单位：秒) */
    time?: number,
    x?: number,
    y?: number,
    color?: cc.Color,
    fontSize?: number,
    horizontalAlign?: cc.Label.HorizontalAlign,
    overflow?: cc.Label.Overflow,
}

/**
 * 冒泡管理单例
 * @example popMgr.show('hello world!')
 */
class PopMgr {
    /** 自定义冒泡节点对象池 */
    private cPool = new cc.NodePool();
    /** 默认冒泡节点对象池 */
    private dPool = new cc.NodePool();
    /** 是否加载了预制体：在未初始化时，调用show方法会自动使用默认类型type=0 */
    private _isLoadedPrefab = false;
    /** 自定义预制体 */
    prefab: cc.Prefab = null;
    /** 默认设置 */
    public DEF = {
        /** 默认 */
        PREFAB_PATH: 'prefab/Pop',
        /** 初始个数 */
        LIMIT: 2,
        FONT_SIZE: 36,
        COLOR: new cc.Color().fromHEX('#FFFFFF'),
        HORIZONTAL_ALIGN: cc.Label.HorizontalAlign.CENTER,
    }

    /**
     * 初始化
     * @param prefabPath Pop预制体的路径
     */
    init(prefabPath?: string) {
        const limit = this.DEF.LIMIT;
        // 初始化默认冒泡
        for (let i = 0; i < limit; i++) {
            const node = this.createDefaultPop();
            this.dPool.put(node);
        }
        prefabPath = prefabPath || this.DEF.PREFAB_PATH;
        cc.loader.loadRes(prefabPath, cc.Prefab, (err, prefab) => {
            if (err) return console.error(err);
            this._isLoadedPrefab = true;
            this.prefab = prefab;
            // 初始化自定义冒泡  
            for (let i = 0; i < limit; i++) {
                const node = cc.instantiate(this.prefab);
                this.cPool.put(node);
            }
        });
    }

    /**
     * 显示冒泡
     * @param {String} str 
     * @param {PopParam} data 
     */
    show(str, data: PopParam = {}) {
        // 得出类型
        let type = data.type;
        if (type == undefined) {
            type = this._isLoadedPrefab ? 1 : 0;
        }
        if (type == 1) {
            type = this._isLoadedPrefab ? 1 : 0;
        }
        // 获取节点
        const node = this.getPop(type);
        this.setData(node, str, data, type);
        // 运行动画 
        this.runPop(node, data.time || 1.5, type);
    }

    /** 设置数据 */
    setData(node: cc.Node, str: string, data: PopParam, type: number) {
        // 设定节点
        let parent = data.parent || cc.director.getScene().getChildByName('Canvas');
        node.parent = parent;
        let width = parent.width;
        let height = parent.height;
        node.x = data.x || 0;
        node.y = data.y || 100;
        const label = type == 1 ? node.getComponentInChildren(cc.Label) : node.getComponent(cc.Label);
        label.string = str;
        label.node.color = data.color || this.DEF.COLOR;
        label.fontSize = data.fontSize || this.DEF.FONT_SIZE;
        label.horizontalAlign = data.horizontalAlign || this.DEF.HORIZONTAL_ALIGN;
        label.overflow = data.overflow || cc.Label.Overflow.RESIZE_HEIGHT;
        if (type == 0) {
            label.node.width = width * 0.9;
        }
    }

    /** 创建默认冒泡 */
    createDefaultPop() {
        const node = new cc.Node('Pop')
        node.addComponent(cc.Label);
        return node;
    }
    /** 创建自定义冒泡 */
    createCustomPop() {
        return cc.instantiate(this.prefab);
    }
    /** 获取pop节点 */
    getPop(type): cc.Node {
        const pool = type == 1 ? this.cPool : this.dPool;
        let node = pool.get();
        if (!node) {// 如果没有空闲对象，也就是对象池中备用对象不够时，我们就用 cc.instantiate 重新创建
            node = type == 1 ? this.createCustomPop() : this.createDefaultPop();
        }
        return node;
    }
    /** 回收pop节点 */
    putPop(node, type) {
        const pool = type == 1 ? this.cPool : this.dPool;
        if (pool.size() < this.DEF.LIMIT) {
            pool.put(node);
        } else {
            node.destroy();
        }
    }

    runPop(node, time, type) {
        node.stopAllActions();
        var act = cc.tween(node)
            .set({ opacity: 0 })
            .to(0.5, { opacity: 255 })
            .delay(time)
            .to(0.5, { opacity: 0, y: node.y + 120 }, { easing: 'sineOut' })
            .call(() => { this.putPop(node, type) });
        act.start();
    }

    clear() {
        this.cPool.clear();
        this.dPool.clear();
    }
}

let popMgr = new PopMgr();
export default popMgr;