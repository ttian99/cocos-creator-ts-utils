/**
 * native 调用类  
 * https://docs.cocos.com/creator/manual/zh/advanced-topics/java-reflection.html
 * 
 * java那边通过cmd来区分要做什么操做
 *
 *  @example
 *  cc.nat.jsToNative({
 *      cmd: 'test', 
 *  }, () => {
 *      cc.log('jsToNative callback!');
 *  }) 
 */
class NativeBridge {

    // JAVA_PACKAGE_NAME = "com.xync.nearme.gamecenter";
    JAVA_PACKAGE_NAME = "com.r2games.zqzc";

    seed = 1; // trans 种子
    taskList = {}; // js主动发起的任务
    eventList = {}; // js被动监听的事件

    constructor() {

    }

    /** java调用js类方法 */
    nativeToJs(jsonStr) {
        let json: any = jsonStr;
        console.log('==> nativeToJs : ' + jsonStr);
        if (typeof (json) != 'object') {
            try {
                json = JSON.parse(jsonStr);
            } catch (e) {
                console.error('== parse nativeToJs str failed: ' + e);
                return;
            }
        }

        const seed = json.seed + ''; // 种子
        const cmd = json.cmd + ''; // 事件
        if (seed) {
            if (!this.taskList[seed]) return;
            this.taskList[seed](json);
            delete this.taskList[seed];
        } else {
            if (!this.eventList[cmd]) return;
            this.eventList[cmd](json);
        }
    }

    /** java调用js方法 */
    jsToNative(json, cb?) {
        if (cb) {
            json.seed = this.seed++;
            this.taskList[json.seed + ''] = cb;
        }
        const jsonStr = JSON.stringify(json);
        console.log('== jsToNative: ' + JSON.stringify(json));
        var result = 1;
        if (cc.sys.isNative && cc.sys.os == cc.sys.OS_IOS) {
            result = jsb.reflection.callStaticMethod("NativeBridge", "jsToNative:", jsonStr);
        }
        else if (cc.sys.os == cc.sys.OS_ANDROID) {
            /**
             * 方法签名
             * Java类型	 签名
             * int	     I
             * float	 F
             * boolean	 Z
             * String	 Ljava/lang/String;
             */
            let javaPackageName = this.JAVA_PACKAGE_NAME;
            javaPackageName = javaPackageName.replace(/\./ig, '/');
            const className = `${javaPackageName}/NativeBridge`;
            
            result = jsb.reflection.callStaticMethod(className, "jsToNative", "(Ljava/lang/String;)Ljava/lang/String;", jsonStr);
        }

        return result;
    }

    on(eventName, cb) {
        this.eventList[eventName] = cb;
    }

    off(eventName) {
        delete this.eventList[eventName];
    }
}

export default NativeBridge;
