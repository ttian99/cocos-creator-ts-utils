const { ccclass, menu, property } = cc._decorator;

// const BlockEvents = ['touchstart', 'touchmove', 'touchend', 'touchcancel',
//                      'mousedown', 'mousemove', 'mouseup',
//                      'mouseenter', 'mouseleave', 'mousewheel'];

const BlockEvents = [
  'touchstart', 'touchmove', 'touchend', 'touchcancel', 
  'mousedown', 'mousemove', 'mouseup','mouseenter', 'mouseleave', 'mousewheel'
];

function stopPropagation (event) {
    event.stopPropagation();
}

/**
 * 吞噬触摸事件
 */
@ccclass
@menu('comp/BlockInputEvent')
export default class BlockInputEvent extends cc.Component {
  onEnable() {
    // this.node.on(cc.Node.EventType.TOUCH_START, stopPropagation, this);
    for (var i = 0; i < BlockEvents.length; i++) {
      // supply the 'this' parameter so that the callback could be added and removed correctly,
      // even if the same component is added more than once to a Node.
      this.node.on(BlockEvents[i], stopPropagation, this);
    }
  }
  onDisable() {
    for (var i = 0; i < BlockEvents.length; i++) {
      this.node.off(BlockEvents[i], stopPropagation, this);
    }
    // this.node.off(cc.Node.EventType.TOUCH_START, stopPropagation, this);
  }
  _swallowTouch(event) {
    event.stopPropagation(); // 阻止事件向下传递
  }
}
