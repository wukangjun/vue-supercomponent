/*
* 表单验证的所有处理方法
* name: wukangjun
* time: 2017.07.13
*/

import {COMMON,service} from "@/utils"

export default{
	methods: {
		checkAge(rules, value, callback){
			if(!value){
				callback(new Error(this.$t('message.isAge')))
			}else if(service.isNumber(value)){
				callback(new Error(this.$t('message.mustNum')))
			}else{
				if(value > 100){
					callback(new Error(this.$t('message.beyondLimit')))
				}else if(value < 18){
					callback(new Error(this.$t('message.isNot18')))
				}else{
					callback()
				}
			}
		},
		checkComapnyName(rules,value,callback){
			if(!value){
				callback(new Error(this.$t('message.isEmpty')))	
			}else if(value.length>=200||value.length<=2){
				callback(new Error(this.$t('message.CompanyLength')))
			}else {
				service.http({
					url:COMMON.baseUrl+'/enterprise/addEnterprise',
                	params:{}
				}).then((data)=>{
					if (!data.flag && !!data.errorCode)
						this.$notify.error({message: this.$t("error."+data.errorCode)});
					else{
						console.log("成功");
						callback();
					}
				});
				
			}
		}
	}
}