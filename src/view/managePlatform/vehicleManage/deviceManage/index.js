import {http, COMMON} from '@/utils/index.js'
export default{
	state: {},
	actions: {
		// 查询设备列表接口
		queryEquipment({commit}, params){
			return http({
				url: COMMON.commonPath + 'equipment/queryEquipment.do',
				params: params
			})
		}
	}
}