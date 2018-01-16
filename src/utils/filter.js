/*
 * name: 所有过滤的方法
 * author: wukangjun
 * time: 2017.07.11
 */
import Vue from 'vue'
import service from './service.js'
import onlineIcon from '@/assets/img/map/tsp_green.png'
import unlineIcon from '@/assets/img/map/tsp_gray.png'
import alramIcon from '@/assets/img/map/tsp_red.png'
import extremIcon from '@/assets/img/map/tsp_yellow.png'
import stopIcon from '@/assets/img/map/tsp_blue.png'
import unknow from '@/assets/img/map/tsp_black.png'
import grayAlarm from '@/assets/img/map/vehicle_direction_0.gif'
import unlineAlarm from '@/assets/img/map/1.gif'
import lineAlarm from '@/assets/img/map/2.gif'
import stopAlarm from '@/assets/img/map/3.gif'
import extremAlarm from '@/assets/img/map/4.gif'

let vm = new Vue()
let filters = {};

//是否注册成功 0--已注册 1--注册
filters.isRegisterFilter = function (item) {
    let filter = parseInt(item);
    if (filter == 0) {
        return vm.$t('filter.register');
    } else if (filter == 1) {
        return vm.$t('filter.noregister');
    } else {
        return "";
    }
}
// 车辆使用状态
filters.isStuas = item => {
    if (item == '0') {
        return vm.$t('filter.onStatus');
    } else {
        return vm.$t('filter.noStatus');
    }
}

// 车辆是否定位
filters.isLocatiion = item => {
    if(item == '1'){
        return '定位';
    }else{
        return '未定位';
    }
}

// 车辆树是否在线和离线，返回图片还是文字
filters.isOnline = (item = {}, flag = false) => {
    // 车牌号不存在-----图片为未知
    if (item.plateCode == undefined) {
        return flag ? '--' : unknow;
    }
    if(Number(item.locateStatus) === 0){
        return flag ? '定位异常' : extremIcon;
    }
    if ((Number(item.vehicleStatus) == 0) && (item.alarmCount > 0)) {
        return flag ? '车辆离线报警' : grayAlarm;
    } else if (Number(item.vehicleStatus) === 0) {
        return flag ? '车辆离线' : unlineIcon;
    }

    if (!item.locationDesc && Number(item.alarmCount) > 0) {
        return flag ? '定位异常报警' : extremAlarm;
    } else if (!item.locationDesc) {
        return flag ? '定位异常' : extremIcon;
    }

    if ((Number(item.gpsSpeed) == 0) && Number(item.alarmCount) > 0) {
        return flag ? '车辆停驶报警' : stopAlarm;
    } else if (Number(item.gpsSpeed) == 0) {
        return flag ? '车辆停驶' : stopIcon;
    }

    if ((Number(item.vehicleStatus) === 1) && (Number(item.alarmCount) > 0)) {
        return flag ? '车辆在线报警' : lineAlarm;
    } else if (Number(item.vehicleStatus) === 1) {
        return flag ? '车辆在线' : onlineIcon;
    }
}
// 车辆树是否在线和离线
filters.isOnlineState = (item) => {
    if (item == '1') {
        return vm.$t('filter.online')
    } else {
        return vm.$t('filter.offline')
    }
}
// ACC状态
filters.accStatus = (item) => {
    return item == "1" ? "ACC(开)" : "ACC(关)";
}
filters.locationStatus = (item,flag) => {
    return item == "1" ?flag?"定位":'#a0d468':flag? "未定位":'red';
}
filters.oilWayStatus = (item) => {
    if (item == "1") {
        return "油路正常";
    } else if (item == "0") {
        return "油路断开";
    } else {
        return "--";
    }
}
filters.circuitStatus = (item) => {
    if (item == "1") {
        return "电路正常";
    } else if (item == "0") {
        return "电路断开";
    } else {
        return "--";
    }
}
filters.doorLockStatus = (item) => {
    if (item == "1") {
        return "车门加锁";
    } else if (item == "0") {
        return "车门解锁";
    } else {
        return "--";
    }
}
filters.locateStatus = (item) => {
    if (item == "1") {
        return "定位";
    } else if (item == "0") {
        return "未定位";
    } else {
        return "--";
    }
}

filters.operateStatus = (item) => {
    if (item == "1") {
        return "运营";
    } else if (item == "0") {
        return "停运";
    } else {
        return "--";
    }
}

filters.artificialLiftStatus = (item) => {
    return item == "0" ? "否" : "是";
}

filters.topCapStatus = (item) => {
    if (item == "0") {
        return "关";
    } else if (item == "1") {
        return "开";
    } else {
        return "--";
    }
}
// 车牌颜色
filters.plateCodeColor = (item) => {
    switch (item) {
        case "1":
            return vm.$t('filter.colorBlue');
        case "2":
            return vm.$t('filter.colorYellow');
        case "3":
            return vm.$t('filter.colorBlack');
        case "4":
            return vm.$t('filter.colorWhite');
        case "5":
            return vm.$t('filter.colorGreen');
        case "9":
            return vm.$t('filter.color');
        default:
            return '未知';
            break
    }
}
//报警配置状态
filters.alarmStatus = (item) => {
    switch (item) {
        case '0':
            return '未开启';
        case '1':
            return '开启';

    }
}
// 车牌颜色
filters.plateCodeColor1 = (item) => {
    switch (item) {
        case "1":
            return '#2b62d0';
        case "2":
            return '#eba239';
        case "3":
            return '#000';
        case "4":
            return '#fff';
        case "5":
            return '#a0d468';
        case "9":
            return '#2b62d0';
        default:
            break
    }
}
filters.icType=(item)=>{
    switch (item) {
        case 1:
            return "上班";
        case 2:
            return "下班";
        default:
            break
    }


}
filters.icResult=(item)=>{
    switch (item) {
        case 0:
            return "读卡成功";
        case 1:
            return "密钥错误";
        case 2:
            return "卡被锁";
        case 3:
            return "卡被拔出";
        case 4:
            return "数据校验失败";
        default:
            break
    }


}
filters.isSendTo=(item)=>{
    switch (item) {
        case 0:
            return "否";
        case 1:
            return "是";
        default:
            break
    }


}

// 上级平台车辆类型
filters.superPlatformCarType = (item) => {
    switch (item) {
        case 0:
            return '普通车辆';
        case 1:
            return '跨域货车';
        case 2:
            return '跨域客车';
        default:
            break
    }
}

// 多媒体管理(类型)
filters.mediaType = (item) => {
    switch (item) {
        case 0:
            return vm.$t('filter.picture');
        case 1:
            return vm.$t('filter.music');
        case 2:
            return vm.$t('filter.video');
        default:
            break
    }
}

// 多媒体管理(格式)
filters.formatter = (item) => {
    switch (item) {
        case 0:
            return vm.$t('filter.jpg');
        case 1:
            return vm.$t('filter.tif');
        case 2:
            return vm.$t('filter.mp3');
        case 3:
            return vm.$t('filter.wav');
        case 4:
            return vm.$t('filter.wmv');
        default:
            break
    }
}
// 报警处理状态(类型)
filters.alarmTp = (item) => {
    switch (item) {
        case 0:
            return '未处理';
        case 2:
            return '不做处理';
        case 3:
            return '将来处理';
        case 1:
            return '处理完毕';   
        default:
            break
    }
}
filters.timeT=(item)=>{
    return item=item.substring(0,2);
}
// 多媒体管理(触发事件类型)
filters.eventType = (item) => {
    switch (item) {
        case 0:
            return vm.$t('filter.incident0');
        case 1:
            return vm.$t('filter.incident1');
        case 2:
            return vm.$t('filter.incident2');
        case 3:
            return vm.$t('filter.incident3');
        default:
            break
    }
}

// 文字是否有值 --- unit文本的单位，当item有值的情况下，存在单位
filters.isValue = (item, unit) => {
    if (item) {
        return unit ? (item + unit) : item;
    } else {
        return '/'
    }
}

//地图类型过滤
filters.mapType = (item) => {
    switch (item) {
        case 1:
            return '百度';
        case 2:
            return '谷歌';
        case 3:
            return '高德';
        default:
            break
    }
}
//运营车辆类型过滤
filters.enterpriseType = (item) => {
    let items = item.split(','),
        reArr = [];
    items.forEach(ele => {
        switch (ele) {
            case '1':
                reArr.push('货运')
                break;
            case '2':
                reArr.push('渣土')
                break;
            case '3':
                reArr.push('环卫')
                break;
            case '4':
                reArr.push('客运')
                break;
        }
    });
    return reArr.length == 0?'':reArr.join(',')
}
// 方向过滤
filters.direction = (item) => {
    let direction = [
        "正北", "东偏北", "东北", "北偏东",
        "正东", "南偏东", "东南", "东偏南",
        "正南", "西偏南", "西南", "南偏西",
        "正西", "北偏西", "西北", "西偏北"
    ];
    let index = Math.floor((parseInt(item) + 11) % 360 / 22.5);
    return direction[index];
}
// liftingState--举升状态 
filters.liftingState = (item) => {
    if (item == '0') {
        return 1
    } else if (item == '1') {
        return 2
    } else {
        return ''
    }
}
// 开盒盖状态
filters.openCapState = (item) => {
    if (item == '0') {
        return 3
    } else if (item == '1') {
        return 4
    } else {
        return ''
    }
}
filters.loadCondition = (item) => {
    if (item == '00' || item == '10') {
        return 5
    } else if (item == '01') {
        return 6
    } else if (item == '11') {
        return 7
    } else {
        return ''
    }
}
// 不同状态显示不同的信息
filters.switchState = (item) => {
    let html = "";
    switch (item) {
        case 1:
            return html = '未举升';
        case 2:
            return html = '举升';
        case 3:
            return html = '顶盖闭合';
        case 4:
            return html = '顶盖开启';
        case 5:
            return html = '空载';
        case 6:
            return html = '半载';
        case 7:
            return html = '满载';
        default:
            return html = '未知';
    }
}
//can状态
filters.canDataReturn = (item) =>{
    let html = ''
    switch(item.seriesName){
        case '行驶速度':
        return html = item.data + ' (km/h)';
        case 'GPS速度':
        return html = item.data + ' (km/h)';
        case '油耗':
        return html = item.data + ' (L)';
        case 'ACC开关':
        return html = (item.data==1||item.data == true)?' 开':' 关';
        default:
        return html = '未知';
    }
}

// 报警级别过滤
filters.alarmLevel = (item) => {
    switch (item) {
        case 0:
            return '紧急报警';
        case 1:
            return '中级报警';
        case 2:
            return '一般报警';
        case 3:
            return '信息提示';
        default:
            return '未知'
    }
}
filters.orderTypeS = (item)=>{
    switch (item) {
        case 0:
            return '初始';
        case 1:
            return '成功';
        case 2:
            return '设备不在线';
        case 3:
            return '失败';
        case 4:
            return '等待回应超时';
        case 5:
            return '等待回应中';
        case 6:
            return '作废';
        default:
            return '未知'
    }
},
filters.stateType = (item)=>{
    switch (item) {
        case 10:
            return '所有';
        case 0:
            return '下级平台所属单一平台';
        case 1:
            return '当前连接的下级平台';
        case 2:
            return '下级平台所属单一业户';
        case 3:
            return '下级平台所属所有业户';
        case 4:
            return '下级平台所属所有平台';
        case 5:
            return '下级平台所属所有平台和业户';
        case 6:
            return '下级平台所属所有政府监管平台（含监控端）';
        case 7:
            return '下级平台所属所有企业监控平台';
        case 8:
            return '下级平台所属所有经营性企业监控平台';
        case 9:
            return '下级平台所属所有非经营性企业监控平台';     
        default:
            return '未知'
    }
}
//能力id值过滤 1---温度；2---承重；3---速度；4---顶盖开启；5---车斗举升
filters.abillityIds = (item, id) => {
    if (item) {
        let itemIds = item.split(',')
        let itemid = itemIds.find(val => {
            return val == id;
        })
        return itemid ? true : false;
    } else {
        return false
    }
}

// 承重的过滤
filters.bearing = item => {
    if (+item >= 0 && +item <= 30) {
        return '空载'
    } else if (+item > 30 && +item <= 70) {
        return '半载'
    } else if (+item > 70 && +item <= 100) {
        return '满载'
    } else if (item == "-1") {
        return '保留'
    }
}
// 疲劳驾驶报警类型
filters.tiredAlarmType = item => {
    switch(item){
        case 0: return '无报警';
        case 1: return '疲劳提醒';
        case 2: return '打哈欠报警';
        case 3: return '视线偏离前方报警';
        case 4: return '抽烟';
        case 5: return '进食';
        case 6: return '离岗报警';
        case 7: return '未识别到人脸';
        case 8: return '打电话';
        case 9: return '人脸不匹配报警';
        befault: return '未知';
    }
}

// 小数点截取相应位数
filters.toFixed = (item, num) => {
    let args = Array.prototype.slice.call(arguments, 1);
    return isNaN(Number(item)) ? "" : Number(item).toFixed(num);
}
//时间范围过滤
//时间格式(2017-8-29 00:00:00) -----> 转换成天数(3.0)
filters.timeRange = (startTime, endTime) => {
    let days = (new Date(filters.timeStamp(endTime)) - new Date(filters.timeStamp(startTime))) / 86400000
    // let days = (new Date(Date.parse(endTime.replace(/-/g, "/"))).getTime()-new Date(Date.parse(startTime.replace(/-/g, "/"))).getTime())/86400000
    // let days = (new Date(endTime) - new Date(startTime)) / 86400000
    // console.log(days1,days)
    let num = days.toFixed(1)
    return num
}

/* 时间过滤*/
// new Date(时间戳) ----> 时间格式化(2017-07-10)
filters.format = (timeNumber, format) => {
    if (!timeNumber) {
        return
    }
    let html,
        timetemp = typeof timeNumber == 'object' ? timeNumber : new Date(Number(timeNumber)),
        year = timetemp.getFullYear(),
        month = timetemp.getMonth() + 1,
        day = timetemp.getDate(),
        hours = timetemp.getHours(),
        mins = timetemp.getMinutes(),
        seconds = timetemp.getSeconds();
    switch (format) {
        case 'yyyy-MM':
            html = year + '-' + (month < 10 ? "0" + month : month);
            break;
        case 'yyyy-MM-dd':
            html = year + '-' + (month < 10 ? "0" + month : month) + '-' + (day < 10 ? "0" + day : day);
            break;
        case 'yyyy-MM-dd start':
            html = year + '-' + (month < 10 ? "0" + month : month) + '-' + (day < 10 ? "0" + day : day) +
                " 00:00:00";
            break;
        case 'yyyy-MM-dd end':
            html = year + '-' + (month < 10 ? "0" + month : month) + '-' + (day < 10 ? "0" + day : day) +
                " 23:59:59";
            break;
        case 'yyyy-MM-dd HH:mm:ss':
            html = year + '-' + (month < 10 ? "0" + month : month) + '-' + (day < 10 ? "0" + day : day) +
                " " + (hours < 10 ? "0" + hours : hours) + ":" + (mins < 10 ? "0" + mins : mins) + ":" + (seconds < 10 ? "0" + seconds : seconds);
            break;
        case 'yyyy/MM/dd HH:mm:ss':
            html = year + '/' + (month < 10 ? "0" + month : month) + '/' + (day < 10 ? "0" + day : day) +
                " " + (hours < 10 ? "0" + hours : hours) + ":" + (mins < 10 ? "0" + mins : mins) + ":" + (seconds < 10 ? "0" + seconds : seconds);
            break;
        case 'yyyy/MM/dd HH:mm':
            html = year + '/' + (month < 10 ? "0" + month : month) + '/' + (day < 10 ? "0" + day : day) +
                " " + (hours < 10 ? "0" + hours : hours) + ":" + (mins < 10 ? "0" + mins : mins);
            break;
        case 'HH:mm:ss':
            html = (hours < 10 ? "0" + hours : hours) + ":" + (mins < 10 ? "0" + mins : mins) + ":" + (seconds < 10 ? "0" + seconds : seconds);
            break;
        default:
            html = year + '-' + (month < 10 ? "0" + month : month) + '-' + (day < 10 ? "0" + day : day) +
                " " + (hours < 10 ? "0" + hours : hours) + ":" + (mins < 10 ? "0" + mins : mins) + ":" + (seconds < 10 ? "0" + seconds : seconds);
            break;
    }
    return html;
}

/*
* 显示当前日期的周---月 ---季度
*/
filters.dateWeekMonth = function(timer, format='yyyy-MM-dd'){
    // 对传入的事件进行处理 转换正确的格式
    const init = timer => {
        if(typeof timer === 'string'){
            return new Date(timer.replace(/(\d{4})[.|/](\d{2})[.|/](\d{2})/g, '$1-$2-$3'));
        }else{
            throw new Error('timer arguments is not string!');
        }
    };
    const options = {
        num: init(timer).getDay(),
        year: init(timer).getFullYear(),
        month: init(timer).getMonth(),
        day: init(timer).getDate()
    };
    const getWeekStart = new Date(options.year, options.month, options.day - options.num);
    const getWeekEnd = new Date(options.year, options.month, options.day + (6 - options.num));
    const getMonthStart = new Date(options.year, options.month, 1);
    const getMonthEnd = new Date(options.year, options.month, filters.getMonthDays(options.year, options.month + 1));
    const getQuarterStart = new Date(options.year, filters.getQuarterStartMonth(options.month), 1);
    const getQuaterEnd = filters.AddDays(filters.AddMonths(getQuarterStart, 3), -1);
    return {
        week: {
            WeekStart: filters.format(getWeekStart, format),
            WeekEnd: filters.format(getWeekEnd, format)
        },
        month: {
            MonthStart: filters.format(getMonthStart, format),
            MonthEnd: filters.format(getMonthEnd, format)
        },
        quarter: {
            QuarterStart: filters.format(getQuarterStart, format),
            QuarterEnd: filters.format(getQuaterEnd, format)
        }
    };
}

/*
 * 时间转换
 * --时间格式化(字符串)（2017-10-13 03:10:40）--> 时间戳
 */
filters.timeStamp = function (str) {
    var timeStamp = new Date(Date.parse(str.replace(/-/g, "/")));
    return timeStamp.getTime();
}

/*
* 得到每个月的天数
*/
filters.getMonthDays = function(myYear, myMonth){
   var days;    
   if (myMonth == 2) {
       days = myYear % 4 == 0 ? 29 : 28;     
   }else if (myMonth == 1 || myMonth == 3 || myMonth == 5 || myMonth == 7 || myMonth == 8 || myMonth == 10 || myMonth == 12) {
       days = 31;
   }else {
       days = 30;    
   }
   return days;
}
/*
* 获取季度的开始月份
*/
filters.getQuarterStartMonth = function(myMonth) {
     if (myMonth <= 2) return 0;
     else if (myMonth <= 5) { return 3; }
     else if (myMonth <= 8) { return 6; }
     else { return 9; }
}
filters.AddDays = function(d, n){
     var t = new Date(d);
     t.setDate(t.getDate() + n);
     return t;
}
filters.AddMonths = function(d, n){
     var t = new Date(d);
     t.setMonth(t.getMonth() + n);
     if (t.getDate() != d.getDate()) { t.setDate(0); }
     return t;
}

// 开始时间与结束时间比较
filters.CompareDate=function(start,end)
{
  return ((new Date(start.replace(/-/g,"\/"))) < (new Date(end.replace(/-/g,"\/"))));
}
// 开始时间是否大于当前系统时间
filters.CompareStartDatetime=function(start,nowtime)
{
  return ((new Date(start.replace(/-/g,"\/"))) > (new Date(nowtime.replace(/-/g,"\/"))));
}
/* 
 * 描述：动态取得本地资源文件内容 
 *  
 * 参数： 
 *   key 对应的资源的key 
 *   params 对应资源中的参数对象(Hash) 
 *    
 * 返回：对应的资源内容 
 *  
 * 用法： 
 *      getLocale("helloParam",{first:value1,second:value2}); 
 */
filters.lanReplace = function (str, params) {
    var result = ""; // 对应的资源的内容  
    if (str && params) {
        result = str;
        var regExp = new RegExp(); //替换资源中参数的正则  
        for (var k in params) {
            regExp = eval("/{{:" + k + "}}/g");
            result = result.replace(regExp, params[k]);
        }
        if (/{{:[a-zA-Z]+}}/.test(result)) {
            result = result.replace(/{{:[a-zA-Z]+}}/g, "No Value");
        }
    }
    return result;
}

/**
 * 
 * @param {*透传下发方式} type 
 */
filters.sendTypes= (type)=>{
    switch(type){
        case 0:
            return vm.$t("transparentInfoSend.gnssModelDetailData");
            break;
        case 11:
            return vm.$t("transparentInfoSend.roadTransICCardInfo");
            break;
        case 65:
            return vm.$t("transparentInfoSend.serialCom1");
            break;
        case 66:
            return vm.$t("transparentInfoSend.serialCom2");
            break;
        case 245:
            return vm.$t("transparentInfoSend.selfDefined245");
            break;
        case -1:
            return vm.$t("transparentInfoSend.userSelfDefined");
            break;
        default:
            break;
    }
}

export default filters