<template>
	<i 
	:class="['el-icon-tsp-'+name]" 
	:style="{'font-size': size+'px','color': color}" 
	class="cv-icon-font">
		<slot></slot>
	</i>
</template>

<script>
	export default{
		name: 'cvIcon',
		componentName: 'cvIcon',
		props: {
			name: {
				default: 'circle'
			},
			size: {
				default: 16
			},
			color: {
				default: ''
			}
		}
	}
</script>

<style lang="scss">
	.cv-icon-font{
		padding: 0 3px;
		cursor: pointer;
	}
</style>

