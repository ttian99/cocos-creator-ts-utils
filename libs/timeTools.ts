/**
 * 时间工具类：常用于时间戳的格式化
 */
class TimeTools {
    /**
      * 格式化时间戳  
      * YYYY	2014	4 或 2 位数字的年份  
      * M MM	1..12	月份数字  
      * D DD	1..31	月的某天  
      * @param str 
      * @param ts 
    */
    format(str = "YYYY年MM月DD日 hh:mm:ss", ts?) {
        let date = ts ? new Date(ts) : new Date();
        const YYYY = date.getFullYear();
        const M = date.getMonth() + 1;
        const MM = M < 10 ? '0' + M : M;
        const D = date.getDate();
        const DD = D < 10 ? '0' + D : D;
        const h = date.getHours();
        const hh = h < 10 ? '0' + h : h;
        const m = date.getMinutes();
        const mm = m < 10 ? '0' + m : m;
        const s = date.getSeconds();
        const ss = s < 10 ? '0' + s : s;
        // 星期几
        const d = date.getDay();
        str = str.replace('YYYY', YYYY + '');
        str = str.replace('MM', MM + '');
        str = str.replace('DD', DD + '');
        str = str.replace('hh', hh + '');
        str = str.replace('mm', mm + '');
        str = str.replace('ss', ss + '');
        str = str.replace('d', d + '');
        return str;
    }

    /**
     * 格式化时间:根据秒数推出hh时mm分ss秒
     * @param str 
     * @param second 
     */
    formatSecond(str, second) {
        const h = Math.floor(second / 3600) % 24;
        const hh = h < 10 ? '0' + h : h;
        const m = Math.floor(second / 60) % 60;
        const mm = m < 10 ? '0' + m : m;
        const s = second % 60;
        const ss = s < 10 ? '0' + s : s;
        str = str.replace('hh', hh + '');
        str = str.replace('mm', mm + '');
        str = str.replace('ss', ss + '');
        return str;
    }
}

let timeTools = new TimeTools();
window.timeTools = timeTools;
export default timeTools;