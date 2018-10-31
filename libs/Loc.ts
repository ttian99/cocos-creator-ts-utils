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
      cc.log('parse [ ' + jsonStr + ' ] failed!');
    }
    return data;
  }

  static setCookie(cName: string, value: any, expiredays: number = 0) {
    const exdate = new Date();
    exdate.setDate(exdate.getDate() + (expiredays * 24 * 60 * 60 * 1000));
    document.cookie = cName + '=' + escape(value) +
      ((expiredays == null) ? '' : ';expires=' + exdate.toGMTString());
  };

  static getCookie(cName: string): string {
    if (document.cookie.length > 0) {
      let cStart = document.cookie.indexOf(cName + '=');
      if (cStart !== -1) {
        cStart = cStart + cName.length + 1;
        let cEnd = document.cookie.indexOf(';', cStart);
        if (cEnd === -1) cEnd = document.cookie.length;
        return unescape(document.cookie.substring(cStart, cEnd));
      }
    }
    return '';
  };
}
window.loc = Loc;
export default Loc;