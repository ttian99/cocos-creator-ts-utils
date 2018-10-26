class Shake extends cc.ActionInterval {
  name = 'cc.Shake';
  _initial_x = 0;
  _initial_y = 0;
  _strength_x = 0;
  _strength_y = 0;
  /**
   *  创建抖动动画
   * @param {number} duration     动画持续时长
   * @param {number} strength_x   抖动幅度： x方向
   * @param {number} strength_y   抖动幅度： y方向
   * @returns {Shake}
   */
  constructor(duration, strength_x, strength_y) {
    super();
    this.initWithDuration(duration, strength_x, strength_y);
  }

  initWithDuration(duration, strength_x, strength_y) {
    cc.ActionInterval.prototype.initWithDuration.call(this, duration);
    this._strength_x = strength_x;
    this._strength_y = strength_y;
    return true;
  }

  update() {
    var plusOrMinus = Math.random() < 0.5 ? -1 : 1;
    let randx = Math.floor(Math.random() * (2 * this._strength_x + 1) + -this._strength_x);
    let randy = Math.floor(Math.random() * (2 * this._strength_y + 1) + -this._strength_y);
    // let randx =Math.randomInt(-this._strength_x, this._strength_x);
    // let randy = Math.randomInt(-this._strength_y, this._strength_y);
    console.log(`randx = ${randx} , randy = ${randy}`);
    this.getTarget().setPosition(randx + this._initial_x, randy + this._initial_y);
  }

  startWithTarget(target) {
    cc.ActionInterval.prototype.startWithTarget.call(this, target);
    console.log(`target.x = ${target.x}, target.y = ${target.y}`);
    this._initial_x = target.x;
    this._initial_y = target.y;
  }

  stop() {
    this.getTarget().setPosition(this._initial_x, this._initial_y);
    console.log(`stop this._initial_x = ${this._initial_x}, this._initial_y = ${this._initial_y}`);
    cc.ActionInterval.prototype.stop.call(this);
  }

}

cc.Shake = Shake;

cc.shake = function (duration, strength_x, strength_y) {
  return new Shake(duration, strength_x, strength_y);
}


// // 抖动 动画
// const Shake = cc.ActionInterval.extend({
//   _initial_x: 0,
//   _initial_y: 0,
//   _strength_x: 0,
//   _strength_y: 0,
//   /**
//    *  创建抖动动画
//    * @param {number} duration     动画持续时长
//    * @param {number} strength_x   抖动幅度： x方向
//    * @param {number} strength_y   抖动幅度： y方向
//    * @returns {Shake}
//    */
//   ctor: function (duration, strength_x, strength_y) {
//     cc.ActionInterval.prototype.ctor.call(this);
//     this.initWithDuration(duration, strength_x, strength_y);
//   },
//   initWithDuration(duration, strength_x, strength_y) {
//     cc.ActionInterval.prototype.initWithDuration.call(this, duration)
//     this._strength_x = strength_x;
//     this._strength_y = strength_y;
//     return true;
//   },
//   update() {
//     let randx = Math.randomInt(-this._strength_x, this._strength_x);
//     let randy = Math.randomInt(-this._strength_y, this._strength_y);
//     this.getTarget().setPosition(randx + this._initial_x, randy + this._initial_y);
//   },
//   startWithTarget(target) {
//     cc.ActionInterval.prototype.startWithTarget.call(this, target);
//     this._initial_x = target.x;
//     this._initial_y = target.y;
//   },
//   stop() {
//     this.getTarget().setPosition(new cc.Vec2(this._initial_x, this._initial_y));
//     cc.ActionInterval.prototype.stop.call(this);
//   },
// });

// cc.shake = function (duration, strength_x, strength_y) {
//   return new cc.Shake(duration, strength_x, strength_y);
// }