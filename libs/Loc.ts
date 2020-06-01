/**
 * @class localStorage 操作类
 */
class Loc {
    static set(key: string, value: any, type: string = 'string') {
        if (!value) value = value + ''; // 排除null和undefined
        let saveData = value;
        if (type === 'object') {
            saveData = JSON.stringify(value);
        }
        cc.sys.localStorage.setItem(key, saveData);
    }

    static get(key: string, type: string = 'string') {
        const storageValue = cc.sys.localStorage.getItem(key);
        if (type === 'boolean') {
            return Boolean(storageValue);
        } else if (type === 'number') {
            return Number(storageValue);
        } else if (type === 'object') {
            return this.safeParse(storageValue)
        } else {
            return storageValue;
        }
    }

    static safeParse(jsonStr: string) {
        let data = null;
        try {
            data = JSON.parse(jsonStr);
        } catch (e) {
            cc.error('parse [ ' + jsonStr + ' ] failed!');
        }
        return data;
    }

    static remove(key: string) {
        return cc.sys.localStorage.removeItem(key);
    }

    static clear() {
        return cc.sys.localStorage.clear();
    }
}

export default Loc;