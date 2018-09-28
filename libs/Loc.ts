/**
 * @class localStorage 操作类
 */
class Loc {
  static set(key: string, value: any) {
    if (!value) value = value + ''; // 排除null和undefined
    let saveData;
    const type = typeof(value);
    console.log('type = ' + type)
    if (type === 'boolean' || type === 'number') {
      saveData = type + ':::' + value.toString();
    } else if (type === 'object') {
      saveData = type + ':::' + JSON.stringify(value);
    } else {
      saveData = type + ':::' + value;
    }
    cc.sys.localStorage.setItem(key, saveData);
  }

  static get(key: string) {
    const storageValue = cc.sys.localStorage.getItem(key);
    if (!storageValue) return storageValue;
    const [type, data] = storageValue.split(':::');
    if (type === 'boolean') {
      return Boolean(data);
    } else if (type === 'number') {
      return Number(data);
    } else if (type === 'object') {
      return this.safeParse(data)
    } else {
      return data;
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