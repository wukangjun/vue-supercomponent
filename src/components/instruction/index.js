import Vue from 'vue'
import { publicApi, instructCallback } from './src/instruction.public.api'

let Instruction = Vue.extend(require('./src/instruction.public.vue'));

export default {
	bind(el, binding){
		if(binding.modifiers.direct || binding.value.direct){
			el.onclick = () => {
				if(!el.id) return Vue.prototype.$message.warning('请选择车辆');
				if( el.params ){
					publicApi({
						url: el.url,
						params: el.params
					}).then(data => {
						instructCallback(data, {callback: el.callback});
					})
				}else{
					publicApi({
						url: el.url,
						data: el.data
					}).then(data => {
						instructCallback(data, {callabck: el.callback});
					})
				}
			}
		}else{
			let instruction = new Instruction({
				el: document.createElement('div'),
				data: {
					dialog: {
						name: binding.value.name,
						size: binding.value.size,
						id: binding.value.id,
						enterpriseId: binding.value.enterpriseId,
						title: binding.value.title,
						callback: binding.value.callback,
						url:binding.value.url,
						type:binding.value.type
					}
				}
			});
			el.instance = instruction;
			el.instruction = instruction.$el;
			el.onclick = () => {
				Vue.nextTick(() => {
					if(!el.id) return Vue.prototype.$message.warning('请选择车辆')
					el.instance.dialog.name = el.name;	
					document.body.appendChild(el.instruction);
					el.instance.dialog.flag = true;
				})
			}
		}
	},
	update(el, binding){	
		el.name = binding.value.name;
		el.id = binding.value.id;
		el.enterpriseId = binding.value.enterpriseId;
		binding.value.url && (el.url=binding.value.url);
		binding.value.type &&(el.type=binding.value.type);
		if(binding.value.url && (binding.value.params || binding.value.data)){
			el.params = binding.value.params;
			el.url = binding.value.url;
			el.data = binding.value.data;
			el.callback = binding.value.callback;
		}
		el.instance&&el.instance.setOptions(
			binding.value.name,
			binding.value.title,
			binding.value.id,
			binding.value.enterpriseId,
			binding.value.size,
			binding.value.callback,
			binding.value.url,
			binding.value.type
		);
	}
}