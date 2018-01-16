<template>
	<div class="cv-search-tree">
		<operation class="operation" ref="operation" v-clickoutside="outHide" v-show="isShow" @add="add" @remove="remove" @modify="modify"></operation>
		<el-input placeholder="搜索" class="tree-search" v-model="search" v-if="isSearch"></el-input>
		<div class="treeArea" v-loading="loading">
			<el-tree node-key="id" :default-expanded-keys="expandArr" :current-node-key="checkedArr" :data="treeData" :show-checkbox="isCheckbox" :props="defaultProps" highlight-current :expand-on-click-node="false" :filter-node-method="filterNode" @node-click="handlerNodes" :render-content="renderContent" ref="searchtree"></el-tree>
		</div>
	</div>
</template>

<script>
import common from '@/utils/mixins/common'
import { http, service, myJq, COMMON } from '@/utils'
import operation from './operation.vue'
export default {
	components: { operation },
	mixins: [common],
	props: {
		interface: {},
		enterpriseId: {},
		isSearch: {
			type: [Boolean],
			default: true
		},
		isCheckbox: {
			type: [Boolean],
			default: false
		},
		isDefault: {
			type: [Boolean],
			default: false
		},
		//是否有编辑按钮 默认为不显示
		isEdit: {
			type: [Boolean],
			default: false
		}
	},
	data() {
		return {
			isShow: false,
			search: "",
			treeData: [],
			defaultProps: {
				children: 'children',
				label: 'text'
			},
			expandArr: [],
			checkedArr: "",
			treeOpts: {       // 树传递参数-- data node store
				data: null,
				node: null,
				store: null,
				func: null,
				type: null,  // 添加类型 add remove modify
				focus: false
			},
			isLabel: true,
			loading: false
		}
	},
	methods: {
		filterNode(value, data) {
			if (!value) return true;
			return data.text.indexOf(value) !== -1;
		},
		//节点点击事件--属性赋值
		handlerNodes(val, node, store) {
			if (!this.treeOpts.focus) {
				this.treeOpts.node = node;
				this.treeOpts.data = val;
				this.treeOpts.store = store;
			}
			if (val.type !== 1) {
				this.$emit('label', val);
			}
		},
		// 获取树的数据
		getTreeData(enterpriseId, type) {
			return new Promise((resolve, reject) => {
				if (service.isUndefined(this.interface)) {
					this.treeData = []
				} else {
					if (!service.isUndefined(enterpriseId) && !service.isContext(enterpriseId)) {
						this.loading = true;
						http({
							url: this.interface,
							params: {
								enterpriseId: enterpriseId || null
							},
						}).then(data => {
							this.loading = false;
							if (service.isObject(data.data)) {
								this.treeData = [data.data];
								resolve([data.data]);
								if (type === 'remove') {
									this.defaultNode([data.data])
								}
							}
						})
					}
				}
			})
		},
		renderContent(h, { node, data, store }) {
			return (
				<span ref="label">
					<cv-span class={[this.isLabel ? 'show' : 'hide']}>{node.label}</cv-span>
					<el-input
						value={node.label}
						class={[this.isLabel ? 'hide' : 'show', 'editInput']}
						on-focus={(event) => this.focuses(event)}
						on-blur={(event) => this.blurs(event)}
					></el-input>
					<span
						style="position:absolute;right:0;top:0;padding: 0 10px"
						class={[this.isEdit ? 'show' : 'hide']}
						on-click={(event) => this.triggerDrop(event, node, data, store)}>
						<i class="el-icon-more"></i>
					</span>
				</span>
			);
		},
		focuses(e) {
			let ev = window.event || e;
			this.treeOpts.focus = true;
		},
		//触发下拉框
		triggerDrop(e, node, data, store) {
			this.isShow = true;
			let ev = window.event || e,
				target = this.$refs['operation'].$el, distance = 10,
				position = this.mousePosition(ev);
			target.style.left = (position.x + distance) + 'px';
			if ((position.y + distance - 0 + 110) - window.innerHeight < 0) {
				target.style.top = (position.y + distance) + 'px';
			} else {
				target.style.top = (position.y + distance - 110) + 'px';
			}
			//当前节点的实例方法
			this.treeOpts.func = store;
		},
		// 成功或失败的回调
		resultCallback(data, success, error, type = 'remove') {
			if (service.isObject(data)) {
				if (data.flag) {
					this.$message.success(success)
				} else {
					this.$message.error(error)
				}
				if (type === 'remove') {
					this.getTreeData(this.enterpriseId, 'remove')
				} else {
					this.getTreeData(this.enterpriseId)
				}

			}
		},
		//失去焦点触发事件
		blurs(e) {
			let ev = window.event || e,
				target = ev.target || ev.srcElement,
				children = this.treeOpts.data.children;
			if (this.treeOpts.type == 'add') {
				children[children.length - 1].text = target.value;
				this.addOrModifyBlur('add');
				if (this.removeNode(this.treeOpts.data)) {
					// 添加车组接口
					this.addFleet({
						pId: this.treeOpts.data.type == 1 ? 0 : this.treeOpts.data.id,
						name: target.value,
						enterpriseId: this.treeOpts.data.enterpriseId
					}).then(data => {
						this.resultCallback(data, this.$t('action.addSuccess'), this.$t('action.addFail'), 'add')
					})
				}
			} else if (this.treeOpts.type == 'modify') {
				this.addOrModifyBlur('modify');
				this.updateFleet({
					id: this.treeOpts.data.id,
					name: (target.value).replace(/\s+/g, ""),
					enterpriseId: this.treeOpts.data.enterpriseId
				}).then(data => {
					this.resultCallback(data, this.$t('action.modifySuccess'), this.$t('action.modifyFail'), 'modify')
				})
			}
			this.treeOpts.focus = false;
			this.expandArr[0] = this.treeOpts.data.id;
			this.checkedArr = this.treeOpts.data.id;
			if (this.treeOpts.data.type !== 1) {
				this.$emit('label', this.treeOpts.data)
			}
		},
		//静态删除符合条件的节点
		removeNode(data) {
			let flag = true;
			if (service.isArray(data.children)) {
				data.children.forEach((val, index) => {
					let text = (val.text).replace(/\s+/g, "");
					if (text == "") {
						data.children.splice(index, 1);
						flag = false;
					}
				})
				return flag
			}
		},
		//删除子节点
		remove() {
			this.treeOpts.type = 'remove';
			if (this.treeOpts.data.type === 1) {
				this.$message.error('根节点不能进行删除操作')
			} else {
				this.confirmPrompt().then(() => {
					if (this.treeOpts.data.children.length > 0) {
						this.$message.error('该节点下存在子节点')
					} else {
						this.treeOpts.func.remove(this.treeOpts.data);
						this.deleteFleet(this.treeOpts.data.id).then(data => {
							this.resultCallback(data, this.$t('action.removeSuccess'), this.$t('action.removeFail'))
						})
					}
				})
			}
			this.isShow = false;
		},
		//添加子节点
		add() {
			let limitLevel = 4;
			this.treeOpts.type = 'add';
			if (this.treeOpts.node.level <= limitLevel) {
				this.expandArr[0] = this.treeOpts.data.id;
				this.expandArr = Array.from(new Set(this.expandArr));
				this.treeOpts.data.children.push({ text: '', children: [] });
				this.getLast(({ input, labelSelf, inputSelf }) => {
					myJq.hide(labelSelf);
					myJq.show(inputSelf, 'inline-block');
					input.$refs.input.focus();
					this.isShow = false;
				})
			} else {
				this.$message.error('车组最多只有' + limitLevel + '层')
			}
		},
		//修改子节点
		modify() {
			this.treeOpts.type = 'modify';
			const { input, labelSelf, inputSelf } = this.toggleLabel();
			if (this.treeOpts.data.type === 1) {
				this.$message.error('根节点不能进行修改操作')
			} else {
				myJq.hide(labelSelf);
				myJq.show(inputSelf, 'inline-block');
				input.$refs.input.focus();
			}
			this.isShow = false;
		},
		//添加或者修改--失去焦点事件
		addOrModifyBlur(type) {
			if (type === 'add') {
				this.getLast(({ input, labelSelf, inputSelf }) => {
					myJq.hide(inputSelf);
					myJq.show(labelSelf, 'inline-block');
				})
			} else if (type === 'modify') {
				let { input, labelSelf, inputSelf } = this.toggleLabel();
				myJq.hide(inputSelf);
				myJq.show(labelSelf, 'inline-block');
			}
		},
		//点击以外会隐藏
		outHide() {
			this.isShow = false;
		},
		//文本输入框切换目标集合
		toggleLabel() {
			let label = this.broadcasts(this.treeOpts.store.$children[0], 'cvSpan'),
				input = this.broadcasts(this.treeOpts.store.$children[0], 'ElInput'),
				labelSelf = label.$refs.span,
				inputSelf = input.$el;
			return { input, labelSelf, inputSelf }
		},
		//获取当前节点最后一个
		getLast(callback) {
			let label, input, labelSelf, inputSelf;
			setTimeout(() => {
				let child = this.treeOpts.store.$children, parent = child[child.length - 1];
				this.broadcastsThen(parent, 'cvSpan', val => {
					label = val
				})
				this.broadcastsThen(parent, 'ElInput', val => {
					input = val
				})
				labelSelf = label.$refs.span;
				inputSelf = input.$el;
				if (typeof callback === 'function') {
					callback({ input, labelSelf, inputSelf })
				}
			}, 100)
		},
		//鼠标点击的坐标
		mousePosition(ev) {
			if (ev.pageX || ev.pageY) {
				return { x: ev.pageX, y: ev.pageY }
			}
			return {
				x: ev.clientX + document.body.scrollLeft - document.body.clientLeft,
				y: ev.clientY + document.body.scrollTop - document.body.clientTop
			}
		},
		//递归子组件
		broadcasts(father, componentName) {
			let children = "";
			father.$children.forEach(child => {
				let name = child.$options.componentName;
				if (name === componentName) {
					children = child;
				} else {
					this.broadcasts(child, componentName)
				}
			})
			if (children) {
				return children
			}
		},
		//异步--同步递归
		broadcastsThen(father, componentName, callback) {
			let children = "";
			father.$children.forEach(child => {
				let name = child.$options.componentName;
				if (name === componentName) {
					children = child;
					if (typeof callback === 'function') {
						callback(children)
					}
				} else {
					this.broadcastsThen(child, componentName, callback)
				}
			})
		},
		//默认展开第一个节点 默认选择第一个节点下的第一个字节点
		defaultNode(data) {
			let first = data[0];
			if (!service.isUndefined(first)) {
				this.expandArr[0] = first.id;
				this.expandArr = Array.from(new Set(this.expandArr));
				let second = first.children[0];
				if (!service.isUndefined(second)) {
					this.checkedArr = second.id;
					this.$emit('label', second)
				}
			}
		},
		//添加车队接口
		addFleet({ pId, name, enterpriseId }) {
			return http({
				url: COMMON.baseUrl + '/fleet/addFleet',
				params: { pId, name, enterpriseId }
			})
		},
		//删除车队接口
		deleteFleet(id) {
			return http({
				url: COMMON.baseUrl + '/fleet/deleteFleet',
				params: { id }
			})
		},
		// 修改车队接口
		updateFleet({ id, name, enterpriseId }) {
			return http({
				url: COMMON.baseUrl + '/fleet/updateFleet',
				params: { id, name, enterpriseId }
			})
		},
		//校验同节点的车队名称
		isExistFleetName({ pId, name, id }) {
			return http({
				url: COMMON.baseUrl + '/fleet/isExistFleetName',
				params: { pId, name, id }
			})
		}
	},
	watch: {
		//有企业id 加载该企业下的树
		enterpriseId(newVal) {
			this.getTreeData(newVal).then(data => {
				this.defaultNode(data)
			})
		},
		search(newVal) {
			this.$refs['searchtree'].filter(newVal)
		}
	},
	mounted() {
		this.getTreeData(this.enterpriseId)
	}
}
</script>

<style lang="scss">
.cv-search-tree {
	position: relative;
	.treeArea {
		position: absolute;
		top: 0px/9;
		top: 46px;
		bottom: 0;
		width: 100%;
		overflow: auto;
		.el-tree {
			border: none;
		}
		.editInput {
			width: 90px;
			height: 20px;
			input {
				width: 90px;
				height: 20px;
			}
		}
		.el-tree-node__content {
			position: relative;
		}
	}
	.vehicleGroupOption {
		position: absolute;
		width: 240px;
		top: -40px;
		left: 0;
		.el-button {
			width: 33.3333333%;
		}
		.el-button:not(:last-child) {
			margin-right: 0;
		}
		.el-button:not(:first-child):not(:last-child) {
			border-color: #ccc;
		}
		.el-button:not(:first-child):not(:last-child):hover {
			border-color: #f7ba2a;
		}
	}
	.el-tree--highlight-current .el-tree-node.is-current>.el-tree-node__content {
		background: #e4e8f1
	}
	.hide {
		display: none;
	}
	.show {
		display: inline-block;
	}
	.operation {
		position: fixed;
		z-index: 2;
	}
}
</style>