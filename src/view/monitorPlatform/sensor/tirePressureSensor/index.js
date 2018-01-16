export default class Manage{
	constructor(options){

	}
	flyWeight(callback){
		let toolPool = [];
		return {
			create(){
				return toolPool.length ? toolPool.shift():callback.apply(this, arguments); 
			},
			recover(div){
				return toolPool.push(div);
			}
		}
	}
}