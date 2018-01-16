import {myJq, service} from '@/utils' 


export default class ScrollbarPagination{
	constructor(name, options){
		this.name = name;
		this.options = service.extend({}, options);
	}
	
}