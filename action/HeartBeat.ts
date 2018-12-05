export default function HeartBeat(initScaleX, initScaleY?, offScaleX = 0.2, offScaleY = offScaleX){
  initScaleY = (initScaleY !== initScaleY) ? initScaleY : initScaleX;
  const act = cc.sequence(
    cc.scaleTo(0.25, initScaleX + offScaleX, initScaleY + offScaleY),
    cc.scaleTo(0.25, initScaleX, initScaleY),
    cc.scaleTo(0.25, initScaleX + offScaleX, initScaleY + offScaleY),
    cc.scaleTo(0.25, initScaleX, initScaleY),
  ).easing(cc.easeSineOut()).repeatForever();
  return act.clone();
}