import Vue from 'vue'
import router from '../router'
import axios from 'axios'
import myService from './service.js'
let vmFilter = new Vue();
let oldToken = null;
export default 
 function http(obj){
	let defaults = myService.extend(true,{
			method: 'post',
			params: {}
		},
		obj);
	return new Promise((resolve, reject) => {
		
		if(oldToken && localStorage.getItem("token") && oldToken != localStorage.getItem("token")){
			console.log('inin')
			location.reload();
		}
		if(localStorage.getItem("token")==null){
			router.push('/login');
		}
		oldToken = localStorage.getItem("token");
		axios.defaults.headers["token"] = localStorage.getItem("token");
		axios.defaults.headers.post["Content-Type"] = "application/json";
		axios.defaults.withCredentials =true;	
		axios(defaults).then(msg => {
			const {flag, data, errorCode} = msg.data;
			if(msg.status==200){
				if(parseInt(errorCode) == 401){
					
					router.push('/login');	
				}else if(parseInt(errorCode) == 402){
					router.push('/login');
				}else if(parseInt(errorCode) == 403){
					Vue.prototype.$notify.error(vmFilter.$t('action.noPromise'));	
					router.push('/login');	
				}else{
					if(flag){
						!errorCode ? resolve({flag: flag, data: data}) : resolve({flag: flag, data: []})
					}else{
						resolve({flag: flag || false, errorCode: errorCode || 500, data: msg.data})
					}
				}
			}
			else if(msg.status==404 || msg.status==500 || msg.status==502){
				resolve({flag: flag || false, errorCode: errorCode || 404 || 500 || 502, data:msg.data})
			}
	
		}, (err) => {
			reject(err)
		});
	})
}
