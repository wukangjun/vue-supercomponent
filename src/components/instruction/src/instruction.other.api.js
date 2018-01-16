import { COMMON, http } from '@/utils'

/**
*	事件下发追加表格
*/
export const getEventInfoPage = function(params){
	return http({
		url: COMMON.baseUrl + '/eventinfo/getEventInfoPage',
		params: params
	})
}

/**
*	车辆点播追加、更新表格
*/
export const getInformationTypePage = function(params){
	return http({
		url: COMMON.baseUrl + '/informationType/getInformationTypePage',
		params: params
	})
}

/**
*	平台协议分组表格
*/
export const getProtocolTransferGroupPage = function(params){
	return http({
		url: COMMON.baseUrl + '/superiorPlatform/getProtocolTransferGroupPage',
		params: params
	})
}