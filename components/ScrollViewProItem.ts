const { ccclass, property, menu } = cc._decorator;

/**
 * ScrollViewProItem 扩展scrollview的子节点加强版本  
 * 将子节点的组件直接继承本组件，可以接受2个方法回调  
 * addToContent() {}  
 * refreshData() {}  
 */
@ccclass
@menu('extra/ScrollViewProItem')
export default class ScrollViewProItem extends cc.Component {

    onEnable() {
        this.node.on('addToContent', this.addToContent, this);
        this.node.on('refreshData', this.refreshData, this);
    }

    onDisable() {
        this.node.off('addToContent', this.addToContent, this);
        this.node.off('refreshData', this.refreshData, this);
    }

    addToContent(idx, data) { }

    refreshData(idx, data) { }
}