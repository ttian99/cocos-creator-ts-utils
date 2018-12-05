import HeartBeat from "./HeartBeat";
import Jump from "./Jump";

enum ACT_LIST {
  JUMP = 101,
  HEART_BEART = 102
}
class ActionManager {
  ACT_LIST = ACT_LIST;

  // 记录初始缩放值
  private saveInitStates(act, node) {
    Object.defineProperties(act, {
      // 'initX': { value: node.x, enumerable: true },
      // 'initY': { value: node.y, enumerable: true },
      'initScaleX': { value: node.scaleX, enumerable: true },
      'initScaleY': { value: node.scaleY, enumerable: true },
    });
  }

  private loadInitStates(act, node) {
    // node.x = act.initX;
    // node.y = act.initY;
    node.scaleX = act.initScaleX;
    node.scaleY = act.initScaleY;
  }


  runJump(node, height, cb) {
    node.stopActionByTag(this.ACT_LIST.JUMP);
    const act = Jump(height);
    act.setTag(this.ACT_LIST.JUMP);
    this.saveInitStates(act, node);
    node.runAction(node);
  }
  stopJump(node) {
    const act = node.getActionByTag(this.ACT_LIST.JUMP);
    node.stopActionByTag(act);
    act && this.loadInitStates(act, node);
  }
  runHeartBeat(node) {
    node.stopActionByTag(this.ACT_LIST.HEART_BEART);
    const act = HeartBeat(node.scaleX, node.scaleY);
    act.setTag(this.ACT_LIST.HEART_BEART);
    this.saveInitStates(act, node);
    node.runAction(act);
  }
  stopHeartBeat(node) {
    const act = node.getActionByTag(this.ACT_LIST.HEART_BEART);
    node.stopAction(act);
    act && this.loadInitStates(act, node);
  }

}

const actMgr = new ActionManager();
export default actMgr;