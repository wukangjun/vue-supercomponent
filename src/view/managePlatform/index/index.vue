<template>
	<div class="myIndex">
		<transition>
			<left-nav 
			class="sideBar" 
			:menu="menus" 
			:search="searchList" 
			@toggle="tog" 
			:class="{transfer: isActive}"></left-nav>
		</transition>
		<v-header></v-header>
		<transition name="el-fade-in">
          <router-view class="content" :class="{transfer1: isActive}"></router-view>
      	</transition> 
	</div>
</template>

<script>
	import leftNav from './nav.vue'
	import vHeader from './header.vue'
	export default{
		name: 'index',
		components: {
			leftNav,
			vHeader
		},
		data(){
			return {
				isActive: false
			}
		},
		methods: {
			tog(flag){
				if(flag){
					this.isActive = false;
				}else{
					this.isActive = true;
				}				
			}
		},
		computed: {
			menus(){
				return this.$store.state.index.menus
			},
			searchList(){
				return this.$store.state.index.searchList
			}
		},
		mounted(){
			console.log(this.$store.state.index.searchList)
			this.$store.dispatch('getMenus')
		}
	}
</script>

<style lang="scss">
	@import '../../../assets/css/common.scss';
	$bg: #e4e8f1;
	.myIndex{		
		.sideBar{
			position: absolute;
			top: 0;
			bottom: 0;
			left: 0;
			width: 250px;
			background: $bg;
			transition: all .05s ease;
		}
		.transfer{
			left: -250px;
		}
		.content{
			transition: all .05s ease;
			position: absolute;
			right: 0;
			left: 250px;
			top: 60px;
			bottom: 0;
			padding: 15px;
			overflow: auto;
			h2{
				padding-bottom: 10px;
			}
		}
		.transfer1{
			left: 0;
		}
	}
</style>