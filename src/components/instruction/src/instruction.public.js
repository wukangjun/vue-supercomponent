import Vue from 'vue'
import { publicApi, instructCallback } from './instruction.public.api'

const InstructionConstructor = Vue.extend(require('./instruction.public.vue'));

InstructionConstructor.prototype.close = function(){
	this.$el && document.body.removeChild(this.$el);
	this.$destroy();
}

/**
*	vue服务写法 {direct: 是否直接发指令, name: 'template名称', id: '车辆id', plateCode: '车辆号'}
*/
const instruct = options => {
	let instruction = null;
	if(options.direct && (options.params || options.data)){
		console.log(optiosn.params)
		// 直接发送指令
		if(options.params){
			publicApi({
				url: options.url,
				params: options.params
			}).then(data => {
				instructCallback(data, options);
			})
		}else if(options.data){
			publicApi({
				url: options.url,
				data: options.data
			}).then(data => {
				instructCallback(data, options);
			})
		}
		
	}else{
		instruction = new InstructionConstructor({
			el: document.createElement('div'),
			data: {
				dialog: {
					name: options.name,
					size: options.size,
					id: options.id,
					title: options.title || '指令下发',
					callback: options.callback
				}
			}
		});
		document.body.appendChild(instruction.$el);
		Vue.nextTick(() => {
		    instruction && (instruction.dialog.flag = true)
		});
	}
	return instruction;
}

export default instruct;