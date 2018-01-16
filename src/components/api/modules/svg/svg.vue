<template>
	<div class="icon">
		<h1>{{name}}</h1>
		<ul class="ul">
			<li v-for="icon in icons">
				<icon :name="icon.key" scale="2" class="svg"></icon>
				<span>{{icon.key}}</span>
				<span>{{icon.name}}</span>
			</li>
		</ul>
	</div>
</template>

<script>
	import index from './index.js'
	export default{
		props: {
			name: {}
		},
		data(){
			return{
				icons: index
			}
		}
	}
</script>

<style lang="scss" scoped>
	.icon{
		ul{
			li{
				float: left;
				margin-top: 10px;
				width: 100px;
				height: 100px;
				text-align: center;
				border-right: 1px solid #ccc;
				border-bottom: 1px solid #ccc;
				.svg{
					padding-top: 0px;
				}
				.svg, span{
					width: 100%;
					display: inline-block;
				}
			}
		}
	}
</style>