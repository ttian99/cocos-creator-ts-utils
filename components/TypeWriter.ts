const { ccclass, property } = cc._decorator;

/**
 * 打字机效果类
 */
@ccclass
export default class TypeWriter extends cc.Component {
    /** 当前节点的label组件 */
    @property(cc.Label) label: cc.Label = null;
    /** 状态: 0-待机, 1-打字中, 2-完成 */
    state: number = 0;
    /** 当前拼接id */
    id: number = 0;
    arr: Array<string> = [];
    /** 频率 */
    interval: number = 0.1;
    curStr = '';
    /** 是否正在打字 */
    get isWriting() {
        return (this.state == 1) ? true : false;
    }

    onLoad() {
        if (!this.label) this.label = this.node.getComponent(cc.Label);
    }
    onEnable() {}
    onDisable() {
        this.reset();
    }
    reset() {
        this.unschedule(this.write);
        this.id = 0;
        this.state = 0;
        this.curStr = '';
        this.arr = [];
        this.render();
    }

    setData(txt) {
        this.reset();
        this.state = 1;
        this.arr = txt.split('');
        this.schedule(this.write, this.interval, cc.macro.REPEAT_FOREVER, 0);
    }

    write() {
        if (this.id >= this.arr.length) {
            this.unschedule(this.write);
            this.state = 2;
            return;
        }
        this.curStr += this.arr[this.id];
        this.id++
        this.render()
    }

    writeOver() {
        this.unschedule(this.write);
        this.state = 2;
        this.id = this.arr.length;
        this.curStr = this.arr.join('');
        this.render();
    }

    render() {
        this.label.string = this.curStr;
    }
}

