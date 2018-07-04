/**
 * @class localStorage 操作类
 */
class Loc {
  static set(key: string, value: any) {
    cc.sys.localStorage.setItem(key, value);
  }

  static get(key: string) {
    const storageValue = cc.sys.localStorage.getItem(key);
    return storageValue;
  }

  static setJson(key: string, json: JSON) {
    cc.sys.localStorage.setItem(key, JSON.stringify(json));
  }

  static getJson(key: string) {
    return this.safeParse(cc.sys.localStorage.getItem(key));
  }

  static setBoolean(key: string, vbar: boolean) {
    const num = vbar ? 1 : 0;
    cc.sys.localStorage.setItem(key, num);
  };

  static getBoolean(key: string) {
    const num = parseInt(cc.sys.localStorage.getItem(key));
    const boolean = (num === 1) ? true : false;
    return boolean;
  };

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

export default Loc;