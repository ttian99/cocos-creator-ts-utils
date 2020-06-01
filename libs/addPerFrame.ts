import logger from "./logger";

/**
 * 迭代器
 */
class Iterator {
    /** 下一次迭代的索引 */
    nextIndex = 0;
    /** 迭代次数 */
    iterationCount = 0;
    _startIndex = 0;
    _endIndex = 0;
    _step = 1;

    constructor(start = 0, end = Infinity, step = 1) {
        this.nextIndex = start;
        this.iterationCount = 0;

        this._startIndex = start;
        this._endIndex = end;
        this._step = step;
    }

    next(): { value: number, done: boolean } {
        let result;

        if (this.nextIndex < this._endIndex) {
            result = { value: this.iterationCount, done: false }
            this.nextIndex += this._step;
            this.iterationCount++
            return result;
        }
        return { value: this.iterationCount, done: true };
    }
}

class AddPerFrame {
    /**
     * 实现分帧加载
     * @param {number} length 迭代长度
     * @param {Function} func 每次迭代回调函数
     * @param {number} limitFrameTime 限制时长（ms）每次执行 Generator 的操作时，最长可持续执行时长。 假设值为5ms，那么表示1帧（总共16ms）下，分出5ms时间给此逻辑执行
     */
    async framingLoad(length: number, func: Function, limitFrameTime = 5) {
        return new Promise((resolve, reject) => {
            // logger.warn('framingLoad start');
            if (length <= 0) {
                logger.warn('framingLoad length is ' + length);
                resolve();
                return;
            }
            const it = new Iterator(0, length - 1);
            resolve(this.executePreFrame(it, func, limitFrameTime))
            // logger.warn('framingLoad over');
        });
    }

    private async executePreFrame(it, func, limitFrameTime) {
        return new Promise(async (resolve, reject) => {
            // logger.debug('每帧运行开始');
            const startTime = Date.now();

            // logger.time('本帧第一次迭代耗时')
            let result = it.next();
            func && await func(result.value);
            // logger.timeEnd('本帧第一次迭代耗时')

            if (!result.done) {
                const duration = Date.now() - startTime;
                // logger.debug('duration', duration);
                if (duration <= 5) {
                    // logger.debug('本帧处理')
                    result = it.next();
                    func && await func(result.value);
                    if (!result.done) {
                        resolve(this.executePreFrame(it, func, limitFrameTime));
                    } else {
                        resolve(result);
                    }
                } else {
                    // logger.debug('下一帧处理 ' + result.value);
                    setTimeout(() => {
                        resolve(this.executePreFrame(it, func, limitFrameTime));
                    });
                }
            } else {
                // logger.error('每帧运行完成');
                resolve(result);
            }
        });
    }
}

const addPerFrame = new AddPerFrame();
export default addPerFrame;