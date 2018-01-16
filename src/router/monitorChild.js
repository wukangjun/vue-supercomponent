/*
* 监控平台的子路由配置
* name: wukangjun
* time: 2017.07.13
*/
const home = (resolve) => require(['../view/monitorPlatform/home/home'], resolve)
const multiCar = (resolve)  => require(['../view/monitorPlatform/vehicleMonitor/multiCar/multiCar'], resolve)
const searchForTimeAndLocation = (resolve)  => require(['../view/monitorPlatform/vehicleMonitor/searchForTimeAndLocation/searchForTimeAndLocation'], resolve)
const area = (resolve)  => require(['../view/monitorPlatform/vehicleMonitor/area/area'], resolve)
const vehiclePeccancy = (resolve)  => require(['../view/monitorPlatform/reportForm/vehiclePeccancy/vehiclePeccancy'], resolve)
const singleAlarm = (resolve)  => require(['../view/monitorPlatform/reportForm/singleAlarm/singleAlarm'], resolve)
const historyTrack = (resolve)  => require(['../view/monitorPlatform/vehicleMonitor/historyTrack/history.track'], resolve)
const fenceManageZt=(resolve) =>require(['../view/monitorPlatform/vehicleMonitor/fenceManageZt/fenceManageZt'],resolve)
const fenceSend=(resolve) =>require(['../view/monitorPlatform/vehicleMonitor/fenceSend/fenceSend'],resolve)
const alarmSearch=(resolve) =>require(['../view/monitorPlatform/alarmManage/alarmSearch/alarmSearch'],resolve)
const alarmHandle=(resolve) =>require(['../view/monitorPlatform/alarmManage/alarmHandle/alarmHandle'],resolve)
const alHandle=(resolve) =>require(['../view/monitorPlatform/alarmManage/alHandle/alHandle'],resolve)
const alarmConfiguration=(resolve) =>require(['../view/monitorPlatform/alarmManage/alarmConfiguration/alarmConfiguration'],resolve)


const RMvideo=(resolve) =>require(['../view/monitorPlatform/video/RMvideo/RMvideo'],resolve)
const multimediaManage=(resolve) =>require(['../view/monitorPlatform/vehicleMonitor/multimediaManage/multimediaManage'],resolve)
const terminalParamSet=(resolve) =>require(['../view/monitorPlatform/vehicleMonitor/terminalParamSet/terminalParamSet'],resolve)
const tirePressureSensor = (resolve) => require(['../view/monitorPlatform/sensor/tirePressureSensor/tirePressureSensor'], resolve)
const blankEntry=(resolve) =>require(['../view/monitorPlatform/video/blankEntry'],resolve)
const video=(resolve) =>require(['../view/monitorPlatform/video/video'],resolve)
const onlineRateCount=(resolve) =>require(['../view/monitorPlatform/reportForm/onlineRateCount/onlineRateCount'],resolve)
const speedDate=(resolve) =>require(['../view/monitorPlatform/reportForm/speedDate/speedDate'],resolve)
const overSpeed=(resolve) =>require(['../view/monitorPlatform/reportForm/overSpeed/overSpeed'],resolve)
const fatigueDriving=(resolve) =>require(['../view/monitorPlatform/reportForm/fatigueDriving/fatigueDriving'],resolve)
const osCount=(resolve) =>require(['../view/monitorPlatform/reportForm/osCount/osCount'],resolve)
const MileageStatistics=(resolve) =>require(['../view/monitorPlatform/reportForm/MileageStatistics/MileageStatistics'],resolve)
const mouthStatistics=(resolve) =>require(['../view/monitorPlatform/reportForm/mouthStatistics/mouthStatistics'],resolve)
const onLineStatistics=(resolve) =>require(['../view/monitorPlatform/reportForm/onLineStatistics/onLineStatistics'],resolve)
const orderStatistics=(resolve) =>require(['../view/monitorPlatform/reportForm/orderStatistics/orderStatistics'],resolve)
const systemLog=(resolve) =>require(['../view/monitorPlatform/reportForm/systemLog/systemLog'],resolve)
const promptlyAlarm=(resolve) =>require(['../view/monitorPlatform/reportForm/promptlyAlarm/promptlyAlarm'],resolve)
const outLineTime=(resolve) =>require(['../view/monitorPlatform/reportForm/outLineTime/outLineTime'],resolve)

const processingLog=(resolve) =>require(['../view/monitorPlatform/reportForm/processingLog/processingLog'],resolve)

const vehicleDriveOperation=(resolve) =>require(['../view/monitorPlatform/reportForm/vehicleDriveOperation/vehicleDriveOperation'],resolve)
const drivingBehavior=(resolve) =>require(['../view/monitorPlatform/reportForm/drivingBehavior/drivingBehavior'],resolve)
const trend=(resolve) =>require(['../view/monitorPlatform/reportForm/trend/trend'],resolve)
const vehicleCheck = (resolve)  => require(['../view/monitorPlatform/vehicleMonitor/vehicleCheck/vehicleCheck'], resolve)
const vehicleTrail = (resolve)  => require(['../view/monitorPlatform/vehicleMonitor/vehicleTrail/vehicleTrail'], resolve)
const eventDefine = (resolve)  => require(['../view/monitorPlatform/vehicleMonitor/eventDefine/eventDefine'], resolve)
const phoneBook = (resolve)  => require(['../view/monitorPlatform/vehicleMonitor/phoneBook/phoneBook'], resolve)
const preDefinedInfo = (resolve)  => require(['../view/monitorPlatform/vehicleMonitor/preDefinedInfo/predefined.info'], resolve)
const informationType = (resolve)  => require(['../view/monitorPlatform/vehicleMonitor/informationType/informationType'], resolve)
const informationSendLog = (resolve)  => require(['../view/monitorPlatform/vehicleMonitor/informationSendLog/informationSendLog'], resolve)
// 车辆监控
const remoteUpdata = (resolve)  => require(['../view/monitorPlatform/vehicleMonitor/remoteUpdata/remoteUpdata'], resolve)
const eventSendDown = (resolve)  => require(['../view/monitorPlatform/vehicleMonitor/eventSendDown/eventSendDown'], resolve)
const onceInstruction = (resolve)  => require(['../view/monitorPlatform/vehicleMonitor/onceInstruction/once.instruction.vue'], resolve)
const information = (resolve)  => require(['../view/monitorPlatform/vehicleMonitor/information/information'], resolve)
const textSendDown = (resolve)  => require(['../view/monitorPlatform/vehicleMonitor/textSendDown/textSendDown'], resolve)
const vehicleInformation = (resolve)  => require(['../view/monitorPlatform/vehicleMonitor/vehicleInformation/vehicleInformation'], resolve)
const transparentInfo = (resolve)  => require(['../view/monitorPlatform/vehicleMonitor/transparentInfo/transparentInfo'], resolve)
const multimediaEvents = (resolve)  => require(['../view/monitorPlatform/vehicleMonitor/multimediaEvents/multimediaEvents'], resolve)
const mediaSingleUpload = (resolve)  => require(['../view/monitorPlatform/vehicleMonitor/mediaSingleUpload/mediaSingleUpload'], resolve)
const askQuestion = (resolve)  => require(['../view/monitorPlatform/vehicleMonitor/askQuestion/askQuestion'], resolve)
const vehicleTrack = (resolve)  => require(['../view/monitorPlatform/vehicleMonitor/vehicleTrack/vehicle.track'], resolve)
const fenceManage=(resolve) =>require(['../view/monitorPlatform/vehicleMonitor/fenceManage/fenceManage'],resolve)
const fenceManageBest = (resolve) =>require(['../view/monitorPlatform/vehicleMonitor/fenceManageBest/fenceManage'],resolve)
// 日志记录
const terminalSuccessMess = (resolve)  => require(['../view/monitorPlatform/logging/terminalSuccessMess/terminal.success.vue'], resolve)
const terminalErrorMess = (resolve)  => require(['../view/monitorPlatform/logging/terminalErrorMess/terminal.error.vue'], resolve)
const textMessRecord = (resolve)  => require(['../view/monitorPlatform/logging/textMessRecord/text.mess.vue'], resolve)
const diverInfo = (resolve)  => require(['../view/monitorPlatform/logging/diverInfo/diverInfo.vue'], resolve)
const platformDataExchange = (resolve)  => require(['../view/monitorPlatform/vehicleMonitor/platformDataExchange/platformDataExchange'], resolve)
const passthrough = (resolve)  => require(['../view/monitorPlatform/logging/passthrough/passthrough.vue'], resolve)
const eventReportLog = (resolve)  => require(['../view/monitorPlatform/logging/eventReportLog/event.report.vue'], resolve)
const MessageLog = (resolve)  => require(['../view/monitorPlatform/logging/MessageLog/MessageLog.vue'], resolve)
const vehicleIsOnlineLog = (resolve)  => require(['../view/monitorPlatform/logging/vehicleIsOnlineLog/vehicle.isonline'], resolve)
const Electronic = (resolve)  => require(['../view/monitorPlatform/logging/Electronic/Electronic.vue'], resolve)
const SuperiorInstruction = (resolve)  => require(['../view/monitorPlatform/logging/SuperiorInstruction/SuperiorInstruction.vue'], resolve)
const inspectLog = (resolve)  => require(['../view/monitorPlatform/logging/inspectLog/inspectLog.vue'], resolve)
const waybill = (resolve)  => require(['../view/monitorPlatform/logging/waybill/waybill.vue'], resolve)
// 行驶记录
const drivingScore=(resolve) =>require(['../view/monitorPlatform/drivingScore/drivingScore'],resolve)
const driverIdCollection=(resolve) =>require(['../view/monitorPlatform/reportForm/driverIdCollection/driverIdCollection'],resolve)
const electricCollection=(resolve) =>require(['../view/monitorPlatform/reportForm/electricCollection/electricCollection'],resolve)
const timeoutDriving=(resolve) =>require(['../view/monitorPlatform/reportForm/timeoutDriving/timeoutDriving'],resolve)
const AccidentSuspect=(resolve) =>require(['../view/monitorPlatform/reportForm/AccidentSuspect/AccidentSuspect'],resolve)
const Recorder=(resolve) =>require(['../view/monitorPlatform/reportForm/Recorder/Recorder'],resolve)
const locationInfo=(resolve) =>require(['../view/monitorPlatform/drivingRecord/locationInfo/locationInfo'],resolve)
const speedRecord=(resolve) =>require(['../view/monitorPlatform/drivingRecord/speedRecord/speedRecord'],resolve)
const paramsRecord=(resolve) =>require(['../view/monitorPlatform/drivingRecord/paramsRecord/paramsRecord'],resolve)
const speedStateLog=(resolve) =>require(['../view/monitorPlatform/drivingRecord/speedStateLog/speedStateLog'],resolve)

// 规则管理
const tiredManage=(resolve) =>require(['../view/monitorPlatform/ruleManage/tiredDriving/index.vue'],resolve)
const adasDriving=(resolve) =>require(['../view/monitorPlatform/ruleManage/adasDriving/index.vue'],resolve)
export default [
	{
		name: 'home',
		path: 'home',
		component: home
	},
	{
		name: 'multiCar',
	    path: 'multiCar',
	    component: multiCar
	},
	{
		name: 'historyTrack',
		path: 'historyTrack',
		component: historyTrack
	},
	{
		name:'fenceManage',
		path:'fenceManage',
		component:fenceManage
	},
	{
		name:'fenceManageBest',
		path:'fenceManageBest',
		component:fenceManageBest
	},
	{
		name:'fenceManageZt',
		path:'fenceManageZt',
		component:fenceManageZt
	},{
		name:'fenceSend',
		path:'fenceSend',
		component:fenceSend
	},{
		name: 'alarmSearch',
		path: 'alarmSearch',
		component: alarmSearch
	},
	{
		name: 'alarmHandle',
		path: 'alarmHandle',
		component: alarmHandle
	},
	{
		name: 'alarmConfiguration',
		path: 'alarmConfiguration',
		component: alarmConfiguration
	},
	{   name: 'speedDate',
		path: 'speedDate',
		component: speedDate
	},
	{
		name: 'alHandle',
		path: 'alHandle',
		component: alHandle
	},
	{
		name: 'multimediaManage',
		path: 'multimediaManage',
		component: multimediaManage
	},{
		name: 'terminalParamSet',
		path: 'terminalParamSet',
		component: terminalParamSet
	},
	{
		name: 'tirePressureSensor',
		path: 'tirePressureSensor',
		component: tirePressureSensor
	},
	{
		name: 'RMvideo',
		path: 'RMvideo',
		component: RMvideo
	}
	,
	{
		name: 'blankEntry',
		path: 'blankEntry',
		component: blankEntry
	},
	{
		name: 'video',
		path: 'video',
		component: video
	},
	{
		name: 'MileageStatistics',
		path: 'MileageStatistics',
		component: MileageStatistics
	},
	{
		name: 'mouthStatistics',
		path: 'mouthStatistics',
		component: mouthStatistics
	},
	{
		name: 'onLineStatistics',
		path: 'onLineStatistics',
		component: onLineStatistics
	},
	{
		name: 'outLineTime',
		path: 'outLineTime',
		component: outLineTime
	},
	{
		name: 'orderStatistics',
		path: 'orderStatistics',
		component: orderStatistics
	},
	{
		name: 'systemLog',
		path: 'systemLog',
		component: systemLog
	},
	{
		name: 'promptlyAlarm',
		path: 'promptlyAlarm',
		component: promptlyAlarm
	},
	{
		name: 'vehicleDriveOperation',
		path: 'vehicleDriveOperation',
		component: vehicleDriveOperation
	},
	{
		name: 'vehicleCheck',
		path: 'vehicleCheck',
		component: vehicleCheck
	},
	{
		name: 'vehicleTrail',
		path: 'vehicleTrail',
		component: vehicleTrail
	},
	{
		name: 'eventDefine',
		path: 'eventDefine',
		component: eventDefine
	},
	{
		name: 'eventSendDown',
		path: 'eventSendDown',
		component: eventSendDown
	},{
		name: 'phoneBook',
		path: 'phoneBook',
		component: phoneBook
	},{
		name: 'informationType',
		path: 'informationType',
		component: informationType
	},{
		name: 'informationSendLog',
		path: 'informationSendLog',
		component: informationSendLog
	},{
		name: 'drivingBehavior',
		path: 'drivingBehavior',
		component: drivingBehavior
	},{
		name: 'trend',
		path: 'trend',
		component: trend
	},{
		name: 'overSpeed',
		path: 'overSpeed',
		component: overSpeed
	},{
		name: 'overSpeed',
		path: 'overSpeed',
		component: overSpeed
	},
	{
		name: 'preDefinedInfo',
		path: 'preDefinedInfo',
		component: preDefinedInfo
	},
	{
		name: 'onlineRateCount',
		path: 'onlineRateCount',
		component: onlineRateCount
	},
	{
		name: 'searchForTimeAndLocation',
		path: 'searchForTimeAndLocation',
		component: searchForTimeAndLocation
	},
	{
		name: 'osCount',
		path: 'osCount',
		component: osCount
	},
	{
		name: 'area',
		path: 'area',
		component: area
	},
	{
		name: 'singleAlarm',
		path: 'singleAlarm',
		component: singleAlarm
	},
	{
		name: 'vehiclePeccancy',
		path: 'vehiclePeccancy',
		component: vehiclePeccancy
	},
	{
		name: 'fatigueDriving',
		path: 'fatigueDriving',
		component: fatigueDriving
	},
	{
		name: 'processingLog',
		path: 'processingLog',
		component: processingLog
	},
	{
		name: 'onceInstruction',
		path: 'onceInstruction',
		component: onceInstruction
	},{
		name: 'information',
		path: 'information',
		component: information
	},{
		name: 'textSendDown',
		path: 'textSendDown',
		component: textSendDown
	},{
		name: 'vehicleInformation',
		path: 'vehicleInformation',
		component: vehicleInformation
	},{
		name:'transparentInfo',
		path: 'transparentInfo',
		component: transparentInfo
	},
	{
		name:'multimediaEvents',
		path: 'multimediaEvents',
		component: multimediaEvents
	},{
		name:'mediaSingleUpload',
		path: 'mediaSingleUpload',
		component: mediaSingleUpload
	},
	{
		name: 'terminalSuccessMess',
		path: 'terminalSuccessMess',
		component: terminalSuccessMess
	},
	{	name: 'platformDataExchange',
		path: 'platformDataExchange',
		component: platformDataExchange
	},{
		name: 'terminalErrorMess',
		path: 'terminalErrorMess',
		component: terminalErrorMess
	},
	{
		name: 'textMessRecord',
		path: 'textMessRecord',
		component: textMessRecord
	},
	{
		name: 'diverInfo',
		path: 'diverInfo',
		component: diverInfo
	},
	{
		name: 'passthrough',
		path: 'passthrough',
		component: passthrough
	},
	{
		name: 'eventReportLog',
		path: 'eventReportLog',
		component: eventReportLog
	},{
		name: 'vehicleIsOnlineLog',
		path: 'vehicleIsOnlineLog',
		component: vehicleIsOnlineLog
	},
	{
		name: 'askQuestion',
		path: 'askQuestion',
		component: askQuestion
	},
	{
		name: 'Electronic',
		path: 'Electronic',
		component: Electronic
	},
	{
		name: 'vehicleTrack',
		path: 'vehicleTrack',
		component: vehicleTrack
	},
	{
		name: 'MessageLog',
		path: 'MessageLog',
		component: MessageLog
	},
	{
		name: 'SuperiorInstruction',
		path: 'SuperiorInstruction',
		component: SuperiorInstruction
	},
	{
		name: 'driverIdCollection',
		path: 'driverIdCollection',
		component: driverIdCollection
	},
	{
		name: 'electricCollection',
		path: 'electricCollection',
		component: electricCollection
	},
	{
		name: 'inspectLog',
		path: 'inspectLog',
		component: inspectLog
	},
	{
		name: 'timeoutDriving',
		path: 'timeoutDriving',
		component: timeoutDriving
	},
	{
		name: 'AccidentSuspect',
		path: 'AccidentSuspect',
		component: AccidentSuspect
	},
	{	
		name:'remoteUpdata',
		path:'remoteUpdata',
		component:remoteUpdata
	},
	{	
		name:'Recorder',
		path:'Recorder',
		component:Recorder
	},
	{
		name:'locationInfo',
		path:'locationInfo',
		component:locationInfo
	},
	{
		name:'speedRecord',
		path:'speedRecord',
		component:speedRecord
	},
	{
		name:'paramsRecord',
		path:'paramsRecord',
		component:paramsRecord
	},
	{
		name:'speedStateLog',
		path:'speedStateLog',
		component:speedStateLog,
	},
	{
		name:'drivingScore',
		path:'drivingScore',
		component:drivingScore
	},
	{
		name:'waybill',
		path:'waybill',
		component:waybill
	},
	{
		name: 'tiredManage',
		path: 'tiredManage',
		component: tiredManage
	},
	{
		name: 'adasDriving',
		path: 'adasDriving',
		component: adasDriving
	}
]

