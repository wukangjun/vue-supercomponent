import ZtreeBase from '@/components/ztree/model/ztree.base.js'
import { service } from '@/utils'

export default class SearchTree extends ZtreeBase{
	constructor(name){
        super(name);
        this.beforeChecked = [];
	}
	searchTreeInit(options){
        var _this = this;
		$.fn.zTree.init(this.poster, {
            data: {
                key: {name: 'text'},
                simpleData: {
                    enable: true,
                    idKey: "id",
                    pIdKey: "pId",
                    rootPId: 0 
                }
            },
            check: {
                enable: options.isCheck,
                nocheckInherit: true,
                chkStyle: "checkbox",
                chkboxType: options.correlation ?{ "Y": "ps", "N": "ps" }:{"Y": "", "N": "" }
            },
            view: {
                selectedMulti: false,
                showLine: false,
                showIcon: false,
                addDiyDom: !options.isCheck&&this.addDiyDom,
                fontCss: this.fontCss
            },
            callback: {
                onClick(event, treeId, treeNode){
                    if(!options.isCheck && typeof options.nodeClick === 'function'){
                        return options.nodeClick(treeNode);
                    }
                },
                beforeCheck(treeId, treeNode){
                    _this.beforeChecked = _this.getCheckedNodes();
                },
                onCheck(event, treeId, treeNode){
                    if(options.isCheck && typeof options.nodeCheck === 'function'){
                        return options.nodeCheck(treeNode, _this.beforeChecked);
                    }
                }
            }
        }, options.data);  
        this.zTree =  $.fn.zTree.getZTreeObj(this.name); 
        this.zTree.expandAll(true); //!options.isCheck
        typeof options.init === 'function' && options.init();
	}
    // 设置字体样式
    fontCss(treeId, treeNode){
        if(!!treeNode.highlight){
            return {color: 'red'}
        }else{
            return {color: '#333'}
        }
    }
}