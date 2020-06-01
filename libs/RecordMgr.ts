// import pf from '../../platform/index';

/** 头条平台判断修饰器 */
function isTTGame(target: any, propertyKey: string, descriptor: PropertyDescriptor) {
    let method = descriptor.value;
    descriptor.value = function (...args) {
        if (typeof tt != 'undefined') {
            method.apply(this, args);
        } else {
            console.log('非头条小游戏,不搭理~~~');
        }
    }
}

/**
 * @class 录屏管理类：只有头条小游戏支持
 */
class RecordMgr {
    /** 录屏状态 0-未录屏 1-录屏中 2-录屏完成 */
    state = 0;
    /** 视频路径 */
    videoPath = '';
    /** 正在启动录制 */
    isStarting = false;
    /** 正在关闭录制 */
    isEnding = false;
    /** 开始录屏时间 */
    startTime = new Date().getTime();
    /** 结束录屏时间 */
    endTime = new Date().getTime();
    
    @isTTGame
    reset() {
        this.state = 0;
        this.videoPath = '';
        this.startTime = new Date().getTime();
        this.endTime = this.startTime;
        this.isStarting = false;
        this.isEnding = false;
    }

    @isTTGame
    startRecord(startCb?, stopCb?, duration = 60) {
        if (this.isStarting) return;
        console.warn('== 开始录屏 ==');
        this.isStarting = true;
        this.onStartRecord(() => {
            console.warn('== 实际录屏启动 ==');
            this.isStarting = false;
            this.state = 1;
            this.startTime = new Date().getTime() 
            startCb && startCb();
        });
        pf.startRecord({ duration: duration });

        this.onStopRecord(() => {
            console.warn('== 自动auto录屏停止 ==');
            this.isEnding = false;
            this.state = 2;
            this.endTime = new Date().getTime();
            const delTime = this.endTime - this.startTime;
            // this.reset();
            stopCb && stopCb(delTime);
        });
    }
    
    @isTTGame
    stopRecord(cb?) {
        console.warn('==> 停止录屏');
        if (this.isEnding) return;
        this.isEnding = true;
        this.onStopRecord(() => {
            console.warn('== 实际录屏停止 ==');
            this.isEnding = false;
            this.state = 2;
            this.endTime = new Date().getTime();
            const delTime = this.endTime - this.startTime;
            cb && cb(delTime);
        });
        pf.stopRecord();
    }

    @isTTGame
    onStartRecord(cb?) {
        pf.onStartRecord((res) => {
            cb && cb(res);
        });
    }
    @isTTGame
    onStopRecord(cb?) {
        pf.onStopRecord((res) => {
            this.videoPath = res.videoPath;
            cb && cb(res);
        });
    }
    @isTTGame
    onErrorRecord(cb?) {
        pf.onErrorRecord((err) => {
            console.error('录屏错误');
            console.error(err);
            this.reset();
            cb && cb(err);
        });
    }

    // @isTTGame
    get recordTime() {
        return this.startTime - this.endTime;
    }

    @isTTGame
    shareVideo(success, fail) {
        pf.shareVideo(this.videoPath, (res) => {
            console.log('成功：分享录屏')
            success && success(res);
        }, (err) => {
            console.log('失败：分享录屏')
            console.log(err);
            fail && fail(err);
        });
        this.reset();
    }
}

let recordMgr = new RecordMgr();
export default recordMgr;