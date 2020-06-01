import EventEx from './EventEx';
import logger from '../libs/logger';

/** 事件对象 */
class EventObj {
    handler: Function = null;
    scope?: any = null;
    times?: any = null;
    constructor(handler = null, scope = null, times = Infinity) {
        this.handler = handler;
        this.scope = scope;
        this.times = times;
    }
}

/** 列表 */
class EventList {
    isEmitting = false; // 正在触发
    list = [];
    cg = false; // 是否需要回收null
}

/**
 * @class EventMgr 事件管理类
 * 
 * 注意：正在遍历触发事件时，添加或者移除事件会造成部分事件被跳过触发
 */
class EventMgr extends EventEx {
    public EVENT = null; // 事件名称的列表
    protected _list = {}; // 事件的保存列表

    init(eventConfig) {
        this.reset();
        this.addList(eventConfig);
    }

    reset() {
        this._list = {};
    }

    /** 将event列表绑定到自身的EVENT, 方便调用 */
    addList(eventConfig) {
        this.EVENT = eventConfig;
    }

    /** 监听事件 */
    on(eventName: string | number, cb: Function, scope: any, times?: number) {
        if (!cb) return logger.error('no cb!');
        let eventList = this._list[eventName];
        if (!eventList) {
            eventList = this._list[eventName] = new EventList();
        }
        const eventObj = new EventObj(cb, scope, times);
        eventList.list.push(eventObj);
    }
    /** 只监听事件一次 */
    once(eventName: string | number, cb: Function, scope: any) {
        this.on(eventName, cb, scope, 1);
    }
    /** 取消监听事件 */
    off(eventName: string | number, cb: Function, scope: any) {
        let eventList = this._list[eventName];
        if (!eventList) return;

        let { list } = eventList;
        let len = list.len;
        if (len < 1) {
            delete this._list[eventName];
            return;
        }
        for (let i = 0; i < list.length; i++) {
            const eventObj = list[i];
            if (!eventObj) continue;
            // 未指定作用域
            if (!scope) {
                if (!cb) { // 未指定回调
                    // 移除所有
                    delete this._list[eventName];
                    return;
                } else { //指定回调
                    if (cb == eventObj.handler) {
                        this.offByIndex(eventName, i)
                    }
                }
                continue;
            }
            // 作用域相同
            if (scope == eventObj.scope) {
                //-指定回调函数
                if (cb) {
                    // 移除:回调函数相同
                    if (cb == eventObj.handler) {
                        this.offByIndex(eventName, i);
                    }
                    // 不移除:回调函数不相同
                    else { }
                }
                //-未指定回调函数: 移除该scope下的所有eventName事件
                else {
                    this.offByIndex(eventName, i);
                }
            }
            // 作用域不同（不移除）
        }
    }

    /** 通过下标取消监听事件 */
    offByIndex(eventName: string | number, index) {
        let eventList = this._list[eventName];
        if (!eventList) return;
        let { isEmitting, list } = eventList;
        // 判断是否正在遍历触发事件
        if (isEmitting) {
            list[index] = null;
            list.cg = true;
        } else {
            list.splice(index, 1);
        }
        // 移除空事件
        if (list.length <= 0) {
            delete this._list[eventName];
        }
    }

    // 消除eventObj.list里面的null事件
    gcNullEvent(list) {
        for (let i = 0; i < list.length; i++) {
            if (!list[i]) {
                list.splice(i, 1)
                i--;
            }
        }
        list.cg = false;
    }
    /** 发射事件 */
    emit(eventName: string | number, data: any = null) {
        let eventList = this._list[eventName];
        // 判断事件是否存在
        if (!eventList) return cc.error(`no such event [${this.EVENT[eventName] || eventName}] is register`);
        let { list } = eventList;
        if (list.length < 1) {
            return cc.error(`event [${eventName}] callback is null`);
        }
        eventList.isEmitting = true;
        for (let i = 0; i < list.length; i++) {
            const eventObj = list[i];
            if (!eventObj) continue;
            var cb = eventObj.handler;
            var scope = eventObj.scope;
            if (scope) {
                cb.call(scope, data);
            } else {
                cb(data);
            }
            if (eventObj.times === 1) {
                this.offByIndex(eventName, i);
            }
        }
        eventList.isEmitting = false;

        if (list.cg) {
            this.gcNullEvent(list);
        }
    }
};

let eventMgr = new EventMgr();
export default eventMgr;