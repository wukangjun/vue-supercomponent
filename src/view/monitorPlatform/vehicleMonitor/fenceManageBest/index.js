
import {http, COMMON} from '@/utils'
export default {
    actions: {
    queryGetFenceRule({commit}, params){
			return http({
				url: COMMON.baseUrl + '/fenece/queryfencerule',
				params: params
			})
		} 
	}
    
}