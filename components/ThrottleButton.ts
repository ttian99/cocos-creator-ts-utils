const { ccclass, property, menu, requireComponent } = cc._decorator;

/**
 * 按钮节流 Throttle
 */
@ccclass
@requireComponent(cc.Button)
@menu('comp/ThrottleButton')
export default class ThrottleButton extends cc.Component {
    @property({
        tooltip: '时间间隔',
        type: cc.Integer,
        step: 1
    }) timer: number = 500;
    /** 上次点击时间戳 */
    lastClickTime = 0;

    onEnable() {
        this.node.on(cc.Node.EventType.TOUCH_START, this.touchStart, this, true);
        this.node.on(cc.Node.EventType.TOUCH_END, this.touchEnd, this, true);
    }
    
    onDisable() {
        this.node.off(cc.Node.EventType.TOUCH_START, this.touchStart, this, true);
        this.node.off(cc.Node.EventType.TOUCH_START, this.touchEnd, this, true);
    }

    touchStart(event: cc.Event.EventTouch) {
        const last = this.lastClickTime || 0;
        let now = Date.now();
        let del = Math.abs(now - last);
        if (del < this.timer) {
            event.stopPropagationImmediate();
        }
    }
    
    touchEnd(event) {
        this.lastClickTime = Date.now();
    }
}
