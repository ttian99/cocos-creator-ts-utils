/**
 * http网络请求类
 */
class Http {
  proxyUrl: string = '';  // 代理地址
  defaultTimeout: number = 10000; // 默认超时的毫秒

  constructor() {
    this.proxyUrl = '';
    this.defaultTimeout = 10000;
  }
  // GET方法
  public static get(url: string, cb: Function, t?: number): void {
    const xhr = new XMLHttpRequest();

    xhr.onload = () => {
      if (xhr.readyState === 4 && ((xhr.status >= 200 && xhr.status <= 300) || xhr.status == 304)) {
        cb && cb(null, xhr.responseText);
      } else {
        cb && cb('请求错误,请稍后再试(DONE)', xhr.status);
      }
    };
    xhr.onerror = (err) => {
      cb && cb('请求错误,请稍后再试', err);
    };

    xhr.open('GET', url, true);

    // XMLHttpRequest 超时。在此做某事。
    xhr.timeout = t || this.defaultTimeout; // 毫秒
    xhr.ontimeout = (e) => {
      xhr.abort();
      cb && cb('请求超时,请稍后再试', { ret: -100 });
    };

    xhr.send();
  }
  // POST方法
  public static post(url: string, params: any, cb: any, t?: any): void {
    if (params instanceof Function) {
      t = cb;
      cb = params;
      params = null;
    }

    const xhr = new XMLHttpRequest();
    xhr.open('POST', url, true);
    xhr.setRequestHeader('Content-type', 'application/x-www-form-urlencoded');

    xhr.timeout = t || this.defaultTimeout; // 毫秒
    xhr.ontimeout = function(e) {
      xhr.abort();
      cb && cb('xhr timeout', { ret: -100 });
    };
    xhr.onerror = function(err) {
      cb && cb('xhr error', err);
    };
    xhr.onload = function() { // Call a function when the state changes.
      if (xhr.readyState === 4 && ((xhr.status >= 200 && xhr.status <= 300) || xhr.status == 304)) {
        cb && cb(null, xhr.responseText);
      } else {
        cb && cb('=> xhr post DONE error', xhr.status);
      }
    };

    params = JSON.stringify(params);
    xhr.send(params);
  }
  // 代理GET方法
  public static proxyGet(url: string, cb: any, t?: any, proxyUrl?: any): void {
    const newUrl = proxyUrl ? `${proxyUrl}?imgUrl=${url}` : `${this.proxyUrl}?imgUrl=${url}`;
    this.get(newUrl, cb, t);
  }
  // 代理POST方法
  public static proxyPost(url: string, params: any, cb: any, t?: any, proxyUrl?: any): void {
    const newUrl = proxyUrl ? `${proxyUrl}?imgUrl=${url}` : `${this.proxyUrl}?imgUrl=${url}`;
    this.post(newUrl, params, cb, t);
  }
}

export default Http;
