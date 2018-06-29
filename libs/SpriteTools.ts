/**
 * 精灵工具类
 */


interface BaseSprite extends cc.Sprite {
  _sgNode: SgNode;
}
interface SgNode {
  setState: Function;
}

class SpriteTools {
  // 设置图片变灰
  public static setGray(sprite: BaseSprite, isGray: boolean, needDelay: boolean) {
    const state = isGray ? 1 : 0;
    if (needDelay) {
      setTimeout(() => {
        sprite._sgNode.setState(state);
      }, 0);
    } else {
      sprite._sgNode.setState(state);
    }
  }

  // 创建精灵节点
  public static createSpriteNode(spriteFrame: cc.SpriteFrame, nodeName: string = '') {
    const node = new cc.Node(nodeName);
    const sprite: cc.Sprite = node.addComponent(cc.Sprite);
    sprite.spriteFrame = spriteFrame;
    return node;
  }

  // 获取精灵的纹理路径: 目前只用于微信小游戏
  public static getTextureUrlAtWechat(spriteFrame: cc.SpriteFrame) {
    const src = spriteFrame._texture._image.src;
    const filePath = src.replace(window.location.origin + '/game/', '');
    return filePath;
  }
}

export default SpriteTools;
