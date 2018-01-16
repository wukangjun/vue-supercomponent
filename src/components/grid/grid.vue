<template>
	<div>
		<slot></slot>
		<component :is="name" :options="this.options" @load="load"></component>
	</div>
</template>

<script>
	import pagination from './pagination.vue'
	export default{
		name: 'cvGrid',
		components: { pagination },
		props: {
            options: {
                default(){
                    return {
                        current: 1,
                        size: 10,
                        total: 0,
                        flag: false
                    }
                }
            },
            isPagination: {
                type: Boolean,
                default: true
            }
        },
		data(){
			return{
				name: 'pagination'
			}
		},
		methods: {
			load(){
				this.$emit('load')
			}
		},
		watch: {
			'options.flag'(newVal){
				newVal && (this.name = "");
				setTimeout(_ => {
					this.name = 'pagination'
				})
			}
		}
	}
</script>

<style lang="scss">
	
</style>