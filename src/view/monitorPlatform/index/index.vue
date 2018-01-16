<template>
	<div class="myIndex">
		<v-header @menu-loaded="menuLoaded"></v-header>
		<best-notice></best-notice>
		<!-- <v-notice></v-notice> -->
		<div class="nav" v-show="$route.name != 'home'">
			<el-breadcrumb separator="/" class="cv-breadcrumb">
			  <el-breadcrumb-item :to="{ path: $route.path }" >{{$store.getters.menuTitle}}</el-breadcrumb-item>
			</el-breadcrumb>
		</div>
		<!-- 公共树 -->
		<public-tree></public-tree>
		<transition  name="el-fade-in">
          <router-view class="contents" id="contents"></router-view>
      	</transition> 
		<el-dialog :close-on-click-modal="false" :visible.sync="dialog.flag" :title="dialog.title" :custom-class="dialog.size">
            <component :is="dialog.name" :options="dialog"></component>
        </el-dialog>     
	</div>
</template>

<script>
	import vHeader from './header.vue'
	import bestNotice from './best-notice.vue' 
	import publicTree from '@/components/public-tree/public.tree.vue'
	import inspectAnswer from './answerS.vue'                  
	export default{
		name: 'index',
		components: {
			vHeader,
			bestNotice,
			publicTree,
			inspectAnswer
		},
		data(){
			return {
				// 查岗dialog
				dialog:{
					flag:false,
					title:'查岗应答',
					size:'dialog-small',
					name:'inspectAnswer',
					mess:{}
				},
				noticeName: '',
				isActive: false
			}
		},
		methods: {
			tog(flag){
				this.isActive = flag ? false : true;			
			},
			menuLoaded(){
				this.noticeName = 'bestNotice';
			}
		},
		computed: {
			menus(){
				return this.$store.state.mtindex.menus
			},
			searchList(){
				return this.$store.state.mtindex.searchList
			},
			
		},
		mounted(){
			this.$store.dispatch('mtgetMenus');		
		},
		watch:{
			'$store.getters.socketInspector'(newVal){
				if(newVal){
					this.dialog.flag = true;
                    this.dialog.name = 'inspectAnswer';
                    this.dialog.mess = newVal;
				}
			}
		}
	}
</script>

<style lang="scss" scoped>
	@import '../../../assets/css/common.scss';	
	$navH: 30px;
	.myIndex{		
		.sideBar{
			position: absolute;
			top: 0;
			bottom: 0;
			left: 0;
			width: 250px;
			background: #e4e8f1;
		}
		.nav{
			clear:both;
			height: $navH;
			line-height: $navH;
			box-sizing: border-box;
			border-bottom: 1px solid #eef1f6;
			.cv-breadcrumb{
				display: inline-block;
				padding-left: 10px;
				font-size:12px;
			}
		}
		.contents{
			position: absolute;
			right: 0;
			left: 0px;
			top: 60px+$navH;
			bottom: 0;
			// overflow: hidden;
			background-color: #f7f6f6;
			h2{
				padding-bottom: 10px;
			}
		}
	}
</style>