


const eps = 1e-6;
const PI = Math.acos(-1);
//三态函数，判断两个double在eps精度下的大小关系
function dcmp(x:number)
{
    if(Math.abs(x)<eps) return 0;
    else
        return x<0?-1:1;
}
//判断点Q是否在p1和p2的线段上
function OnSegment(p1, p2, Q)
{
    //前一个判断点Q在p1p2直线上 后一个判断在p1p2范围上
    return dcmp((p1-Q)^(p2-Q))==0&&dcmp((p1-Q)*(p2-Q))<=0;
}
//判断点P在多边形内-射线法
function inPolygon(p, polygon)
{
    let flag = false; //相当于计数
    let p1,p2; //多边形一条边的两个顶点
    let n = polygon.length;
    for(let i=0,j=n-1;i<n;j=i++)
    {
        //polygon[]是给出多边形的顶点
        p1 = polygon[i];
        p2 = polygon[j];
        if(OnSegment(p1,p2,p)) return true; //点在多边形一条边上
        //前一个判断min(p1.y,p2.y)<p.y<=max(p1.y,p2.y)
        //这个判断代码我觉得写的很精妙 我网上看的 应该是大神模版
        //后一个判断被测点 在 射线与边交点 的左边
        if( (dcmp(p1.y-p.y)>0 != dcmp(p2.y-p.y)>0) && dcmp(p.x - (p.y-p1.y)*(p1.x-p2.x)/(p1.y-p2.y)-p1.x)<0)
            flag = !flag;
    }
    return flag;
}

const MathTools = {inPolygon};
export default MathTools;
