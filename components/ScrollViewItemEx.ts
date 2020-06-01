const { ccclass, property, menu } = cc._decorator;

@ccclass
@menu('extra/ScrollViewItemEx')
export default class ScrollViewItemEx extends cc.Component {
    @property({
        type: [cc.Component.EventHandler],
        tooltip: "进入ScrollView时回调"
    })
    onEnterScorllViewEvents: cc.Component.EventHandler[] = [];

    @property({
        type: [cc.Component.EventHandler],
        tooltip: "离开ScrollView时回调"
    })
    onExitScorllViewEvents: cc.Component.EventHandler[] = [];

    /**
     * 当前是否在展示中
     * 1. 在进入ScrollView期间，为true
     * 2. 在离开ScrolLView期间，为false
     */
    isShowing: boolean = false;

    /** Item 进入 ScrollView 的时候回调 */
    publishOnEnterScrollView() {
        this.isShowing = true;
        cc.Component.EventHandler.emitEvents(this.onEnterScorllViewEvents);
    }

    /** Item 离开 ScrollView 的时候回调  */
    publishOnExitScrollView() {
        this.isShowing = false;
        cc.Component.EventHandler.emitEvents(this.onExitScorllViewEvents);
    }
}