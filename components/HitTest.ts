
const {ccclass, property, menu} = cc._decorator;
import MathTools from '../libs/MathTools'
const math = cc.renderer.renderEngine.math;

let _mat4_temp = math.mat4.create();

@ccclass
@menu('comp/HitTest')
export default class HitTest extends cc.Component {

    @property(cc.Vec2)
    points:cc.Vec2[] = [];

    onLoad () {
        this.node._hitTest = this.hitTest;
    }

    hitTest (point, listener) {
        let node:cc.Node = this instanceof cc.Node ? this : this.node;
        let polygon = node.getComponent("HitTest").points;
        let size = node.getContentSize();
        let w = size.width,
            h = size.height,
            cameraPt = cc.v2(),
            testPt = cc.v2();
        
        let camera = cc.Camera.findCamera(node);
        if (camera) {
            camera.getCameraToWorldPoint(point, cameraPt);
        }
        else {
            cameraPt.set(point);
        }

        let worldMat = math.mat4.create();
        node.getWorldMatrix(worldMat);
        math.mat4.invert(_mat4_temp, worldMat);
        math.vec2.transformMat4(testPt, cameraPt, _mat4_temp);
        let anchorPoint = node.getAnchorPoint();
        testPt.x += anchorPoint.x * w;
        testPt.y += anchorPoint.y * h;

        return MathTools.inPolygon(testPt, polygon);
    }
}
