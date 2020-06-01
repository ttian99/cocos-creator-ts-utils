/** 
 * 日志等级：大于当前设定等级才可以输出日志
 */
enum LEVEL {
    LOG,
    DEBUG,
    TIME,
    PRODUCT,
    WARN,
    ERROR,
    NULL,  //没有日志输出
}

/**
 * 日志管理类
 */
class Logger {
    public LEVEL = LEVEL
    private _curLevel = LEVEL.LOG;

    setLevel(lvl) {
        this._curLevel = lvl;
    }
    getLevel() {
        return this._curLevel;
    }
    isOverLevel(level) {
        return level >= this._curLevel;
    }
    log(msg: string|any, ...subst: any[]) {
        if (!this.isOverLevel(this.LEVEL.LOG)) return;
        // cc.log(msg, ...subst);
        console.log(msg, ...subst);
    }
    debug(msg: string|any, ...subst: any[]) {
        if (!this.isOverLevel(this.LEVEL.DEBUG)) return;
        // cc.log(msg, ...subst);
        console.log(msg, ...subst);
    }
    warn(msg: any, ...subst: any[]) {
        if (!this.isOverLevel(this.LEVEL.WARN)) return;
        // cc.warn(msg, ...subst);
        console.warn(msg, ...subst);
    }
    error(msg: any, ...subst: any[]) {
        if (!this.isOverLevel(this.LEVEL.ERROR)) return;
        // cc.error(msg, ...subst);
        console.error(msg, ...subst);
    }
    time(label: string) {
        if (!this.isOverLevel(this.LEVEL.TIME)) return;
        console.time(label);
    }
    timeEnd(label: string) {
        if (!this.isOverLevel(this.LEVEL.TIME)) return;
        console.timeEnd(label);
    }
}

const logger = new Logger();
export default logger;