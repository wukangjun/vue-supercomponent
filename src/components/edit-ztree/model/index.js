import ZtreeBase from '@/components/ztree/model/ztree.base.js'
import '@/components/ztree/model/jquery.ztree.exedit.js'
import { service } from '@/utils'

let _self = null;
export default class EditTree extends ZtreeBase{
	constructor(name, options){
		super(name, options);
		_self = this;
		_self.newCount = 1;
		this.options = service.extend({}, options);
	}
	set editTreeInit(value){
		$.fn.zTree.init(this.poster, this.setting(this.options.isCheck,this.options.isEdit), value);   
        this.zTree =  $.fn.zTree.getZTreeObj(this.name);   
        this.zTree.expandAll(true);
	}
	// 树的基本设置
    setting(flag,edit){  
        return {
            data: {
                key: {name: 'text'},
                simpleData: { enable: true }
            },
            view: {
                selectedMulti: false,
                showLine: false,
                showIcon: false,
                addDiyDom: this.addDiyDom,
                addHoverDom:edit? this.addHoverDom:null,
                removeHoverDom:edit ? this.removeHoverDom:null,
            },
            edit: {
            	drag:{
					isCopy: false,
					isMove: false
				},
				enable: true,
				editNameSelectAll: false,
				showRemoveBtn:edit? true:false,
				showRenameBtn:edit? true:false
			},
            callback: {
                onClick: this.onClick,
                beforeEditName: this.beforeEditName,
                beforeRemove: this.beforeRemove,
                onRename: this.onRename
            }
        } 
    }
    onClick(event, treeId, treeNode){
        typeof _self.options.methods.nodeClick === 'function' 
        && _self.options.methods.nodeClick(treeNode);
    }
    // 添加编辑
    addHoverDom(treeId, treeNode){
    	let sObj = $("#" + treeNode.tId + "_span");
		if (treeNode.editNameFlag || $("#addBtn_"+treeNode.tId).length>0) return;
		let addStr = "<span class='button add' id='addBtn_" + treeNode.tId
			+ "' title='add node''></span>";
		sObj.after(addStr);
		let btn = $("#addBtn_"+treeNode.tId);
		btn && btn.bind("click", function(){
			if(typeof _self.options.methods.addNode === 'function'){
	    		return _self.options.methods.addNode(treeNode);
	    	}
			return false;
		});
    }
    removeHoverDom(treeId, treeNode){
    	$("#addBtn_"+treeNode.tId).unbind().remove();
    }
    beforeEditName(treeId, treeNode){
    	if(typeof _self.options.methods.beforeEditName === 'function'){
    		return _self.options.methods.beforeEditName(treeNode);
    	}
    }
    beforeRemove(treeId, treeNode){
    	if(typeof _self.options.methods.beforeRemove === 'function'){
    		return _self.options.methods.beforeRemove(treeNode);
    	}
    }
    onRename(e, treeId, treeNode, isCancel){
    	if(typeof _self.options.methods.onRename === 'function'){
    		return _self.options.methods.onRename(treeNode);
    	}
    }
}