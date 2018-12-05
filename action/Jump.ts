export default function Jump(jumpHeight = 200, initScaleX = 1, initScaleY = 1){
  const squashAction = cc.scaleTo(0.2, 1 * initScaleX, 0.6 * initScaleY);
  const stretchAction = cc.scaleTo(0.2, 1 * initScaleX, 1.2 * initScaleY);
  const scaleBackAction = cc.scaleTo(0.1, 1 * initScaleX, 1 * initScaleY);
  const moveUpAction = cc.moveBy(1, cc.v2(0, jumpHeight)).easing(cc.easeCubicActionOut());
  const moveDownAction = cc.moveBy(1, cc.v2(0, -jumpHeight)).easing(cc.easeCubicActionIn());
  const seq = cc.sequence(squashAction, stretchAction, moveUpAction, scaleBackAction, moveDownAction, squashAction, scaleBackAction);
  return seq.clone();
}