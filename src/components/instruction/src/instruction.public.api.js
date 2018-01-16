import Vue from 'vue'
import { COMMON, http } from '@/utils'

let vm = new Vue();
export const publicApi = function(params){
	if(params.data){	
		// 需要data 传参
		return http({
			url: COMMON.baseUrl + params.url,
			data: JSON.stringify(params.data)
		})
	}else{
		return http({
			url: COMMON.baseUrl + params.url,
			params: params.params
		})
	}
}

export const instructCallback = (data, options) => {
	if(data==true || data.flag){
		Vue.prototype.$message.success('指令下发成功');
		options.flag = false;
	}else{
		Vue.prototype.$message.error(vm.$t("error."+data.errorCode));
	}
	typeof options.callback === 'function' && options.callback(data.flag);
}