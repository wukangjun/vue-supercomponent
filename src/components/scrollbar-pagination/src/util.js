
export const delegation = function(event){
	let target = event.target;
	while(target && target.tagName.toUpperCase() !== 'HTML'){
		if(target.tagName.toUpperCase() === 'LI'){
			return target;
		}
		target = target.parentNode;
	}
	return null;
}