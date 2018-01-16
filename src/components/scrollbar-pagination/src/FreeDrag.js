import './freeDrag.css'

export default class FreeDrag {
	constructor(options){
		this.options = options;
		this.renderScrollContent();
		this.renderCtrl();
		this.bindEvent();
	}
	renderCtrl(){
		const ctrls = ['cv-autodrag-top'];	
		ctrls.forEach(ctrl => {
			let div = document.createElement('div');
			div.class = div.className = ctrl;
			this.options.poster && this.options.poster.appendChild(div);
		});
		// 顶部拖动对象
		this.dragTop = this.options.poster.querySelector('.' + ctrls[0]);
	}
	renderScrollContent(){
		this.scrollContent = this.options.poster.querySelector('.tab-content');
		this.scrollContent.style.height = (this.options.minHeight || 140) + 'px';
	}
	bindEvent(){
		const mousemove = (e, distanceY, height) => {
			let docEvent = e || window.event, top = distanceY- docEvent.clientY,
				currentH = height + top;	
			docEvent.preventDefault();
			if(this.minMaxHeightLimit(currentH)){
				this.scrollContent.style.height = this.options.maxHeight + 'px';
			}else{
				this.scrollContent.style.height = (height + top) + 'px';
			}	
		};
		const moveup = e => {
			document.onmousemove = null;
			document.onmouseup = null;
		};
		if(this.dragTop){
			this.dragTop.addEventListener('mousedown', e => {
				let event = e || window.event, distanceY = event.clientY,
					height = parseInt(this.scrollContent.style.height);
				event.preventDefault();
				document.onmousemove = (e) => {
					mousemove(e, distanceY, height);			
				};
				document.onmouseup = (e) => {
					moveup(e);
				}
			})
		}
	}
	minMaxHeightLimit(currentHeight){
		const height = parseInt(currentHeight);
		if(height > this.options.maxHeight){
			return true;
		}else{
			return false;
		}
	}
}