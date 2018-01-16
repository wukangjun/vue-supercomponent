import '@/components/ztree/model/css/zTreeStyle/zTreeStyle.css'
import '@/components/ztree/model/css/myStyle/myStyle.css'
import '@/components/ztree/model/jquery.ztree.core.js'
import '@/components/ztree/model/jquery.ztree.exhide.js'
import './jquery.ztree.excheck.js'
import { service } from '@/utils'

let _self = this;
export default class ZtreeBase {
	constructor(name){
		_self = this;
		this.name = name;
		this.poster = $('#' + this.name);
		this.zTree =  null;  
	}
    addDiyDom(treeId, treeNode){
        let spaceWidth = 10;
        let switchObj = $("#" + treeNode.tId + "_switch"),
            icoObj = $("#" + treeNode.tId + "_ico");
        switchObj.remove();
        icoObj.before(switchObj);
        if (treeNode.level > 0) {
            let spaceStr = "<span style='display: inline-block;width:" + (spaceWidth * treeNode.level)+ "px'></span>";
            switchObj.before(spaceStr);
        }
    }
    /**
    * 查询nodeAPI
    */
    searchAsyncNodes(value, level=1){
        let parents = [],
            val = value.replace(/\s+/g, ""),
            nodeList = this.zTree.getNodesByParamFuzzy('text', val);
        nodeList.forEach(node => {
            let item = node;
            while(item.level > level){
                item = item.getParentNode();
            }
            parents.push(item);
        });
        return {
            value: val,
            child: nodeList,
            parent: parents
        }
    }
    /**
    * 过滤已加载的节点
    */
	filter(value){
        let search;
        const allNodes = this.zTree.getNodes();
        if(allNodes.length > 1){
            search = this.searchAsyncNodes(value, 0);
            this.zTree.hideNodes(allNodes);
        }else{
            search = this.searchAsyncNodes(value);
            this.zTree.hideNodes(allNodes[0].children);      
        }
        this.zTree.showNodes(search.value === "" ? search.child : search.parent);
        this.highlight(value);
    }
    /**
    * 标记以加载的节点为红色
    */
    highlight(value){
        const allNodes = this.zTree.transformToArray(this.zTree.getNodes());
        const search = this.searchAsyncNodes(value); 
        allNodes.forEach(node => {
            node.highlight = false;
            this.zTree.updateNode(node);
        });
        if(value !== ""){
            search.child.forEach(node => {
                node.highlight = true;
                this.zTree.updateNode(node);
            });
        }
    }
    // 删除单一节点
    removeNode(treeNode, callbackFlag){
        _self.zTree && _self.zTree.removeNode(treeNode);
    }
    // 取消单一节点的编辑状态
    cancelEditName(newName){
        _self.zTree && _self.zTree.cancelEditName(newName);
    }
    // 选中节点
    selectNode(treeNode, addFlag, isSilent){
        _self.zTree && _self.zTree.selectNode(treeNode, addFlag, isSilent);
    }
    // 添加节点
    addNodes(treeNode, options){
        _self.zTree && _self.zTree.addNodes(treeNode, options);
    }
    // 给节点编辑
    editName(node){
        _self.zTree && _self.zTree.editName(node);
    }
    // 更新节点属性
    updateNode(treeNode){
        _self.zTree && _self.zTree.updateNode(treeNode);
    }
    //根据节点数据的属性搜索
    getNodesByParam(key, value, parentNode){
        return _self.zTree && _self.zTree.getNodesByParam(key, value, parentNode);
    }
    // 获取勾选或者未勾选的所有节点
    getCheckedNodes(checked = true){
        return _self.zTree && _self.zTree.getCheckedNodes(checked);
    }
    // 获取加载好存在的所有节点
    getAllNodes(){
        return _self.zTree && _self.zTree.getNodes();
    }
    // 勾选所有checkbox 
    checkAllNodes(ids){
        return _self.zTree && _self.zTree.checkAllNodes(true);
    }
    //根据ID数组勾选checkbox
    checkNodeByIds(ids, flag=true){
        if(service.isArray(ids) && ids.length > 0){
            ids.forEach(id => {     
                let vehicle = _self.getNodesByParam('id', id);
                _self.zTree.checkNode(vehicle[0], true, flag);
            })
        }
    }
    // 取消所有勾选
    cancelAllNodes(){
        return _self.zTree && _self.zTree.checkAllNodes(false);   
    }
    // 取消当前所有被选中节点的选中状态
    cancelSelectedNode(node){
        return _self.zTree && _self.zTree.cancelSelectedNode(node);
    }
    setChkDisabled(node, flag, inheritParent, inheritChildren){
        return _self.zTree && _self.zTree.setChkDisabled(node, flag, inheritParent, inheritChildren);
    }
}