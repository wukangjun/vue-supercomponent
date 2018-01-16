export default class Mycanvas{
	constructor(name){
		this.stage = null;
		name.nodeType == 1 ? this.poster = name : this.poster = document.getElementById(name);
		this.initStage();
	}
	// 初始化canvas
	initStage(){
		if(this.poster.getContext){
			this.stage = this.poster.getContext('2d');
		}else{
			throw new Error('this browser is not suppered canvas')
		}
	}
}