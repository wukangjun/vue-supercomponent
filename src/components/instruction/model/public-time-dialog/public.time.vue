<template>
	<el-form>
		<el-form-item label="起始时间:">
			<el-date-picker v-model="dateTime" :editable='false' :clearable='false' type="datetimerange" placeholder="选择时间范围"></el-date-picker>
		</el-form-item>
	</el-form>
</template>

<script>
	export default {
		props: {
			options: {}
		},
		data(){
			return {
				dateTime:[
					this.$filter.timeStamp(this.$filter.format(new Date(), 'yyyy-MM-dd start')),
					this.$filter.timeStamp(this.$filter.format(new Date(), 'yyyy-MM-dd end'))	
				],
			}
		},
		methods: {
			getTimer(){
				console.log(this.dateTime)
				return {
					starttimer:this.$filter.format(this.dateTime[0],'yyyy-MM-dd HH:mm:ss'),
					endtimer: this.$filter.format(this.dateTime[1],'yyyy-MM-dd HH:mm:ss')
				}
			}
		}
	}
</script>