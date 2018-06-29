import EventEx from './EventEx';

/**
 * @class EventObj
 */
class EventObj {
  handlers: Array<Function> = [];
  times: number = -1; //
  constructor() {
    this.handlers = [];
    this.times = -1;
  }
}

/**
 * @class EventMgr
 */
export default class EventMgr extends EventEx {
  EVENT = null; // 事件名称的列表
  protected _list = {}; // 事件的保存列表

  constructor(eventList) {
    super();
    this.EVENT = eventList;
  }
  // 将event列表绑定到自身的EVENT, 方便调用
  addList(eventList) {
    this.EVENT = eventList;
  }

  on(eventName: string | number, cb: Function, scope: any, times: number = -1) {
    if (!this._list[eventName]) {
      this._list[eventName] = new EventObj();
    }
    const callback = scope ? cb.bind(scope) : cb;
    this._list[eventName].handlers.push(callback);
  }

  once(eventName: string | number, cb: Function, scope: any) {
    this.on(eventName, cb, scope, 1);
  }

  emit(eventName: string | number, data: any = null) {
    const eventObj = this._list[eventName];
    if (!eventObj) {
      return cc.error(`no such event [${eventName}] is register`);
    }
    if (eventObj.handlers.length < 1) {
      return cc.error(`event [${eventName}] callback is null`);
    }
    for (let i = 0; i < eventObj.handlers.length; i++) {
      const cb = eventObj.handlers[i];
      cb && cb(data);

      if (i == eventObj.handlers.length - 1) {
        if (eventObj.times === 1) {
          this.off(eventName);
        }
      }
    }
  }

  off(eventName: string | number) {
    this._list[eventName] = null;
    delete this._list[eventName];
  }
};