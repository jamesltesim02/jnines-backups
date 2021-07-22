<template>
	<view class="time_picker">
		<picker-view indicator-style="height: 40px;" :value="value" @change="bindChange" @pic>
			<picker-view-column>
				<!-- 小时 -->
				<view class="item" v-for="(item,index) in hours" :key="index">{{item}}</view>
			</picker-view-column>
			<view class="dot">
				:
			</view>
			<picker-view-column>
				<!-- 分钟 -->
				<view class="item" v-for="(item,index) in minutes" :key="index">{{item}}</view>
			</picker-view-column>
		</picker-view>
	</view>
</template>

<script>
	export default{
		data() {
			const date = new Date()
			const hour = date.getHours()
			const hours = []		
			const minutes = []
			for (let x = 1; x <= 10; x++) {
				for (let y = 0; y <= 23; y++) {
					if (y < 10) {
						hours.push('0' + y)
					} else {
						hours.push('' + y)
					}
				}
			}
			for (let x = 1; x <= 50; x++) {
				for (let y = 0; y <= 45; y += 15) {
					if (y < 15) {
						minutes.push('0' + y)
					} else {
						minutes.push('' + y)
					}
				}
			}
			return {
				minute: '',
				minutes,
				hour,
				hours,
				value: [hour + 121, 100]
			}
		},
		created() {
			this.$emit('timeChange',this.hours[this.value[0]],this.minutes[this.value[1]])
		},
		methods:{
			bindChange(e) {
				const val = e.detail.value
				this.$emit('timeChange',this.hours[val[0]],this.minutes[val[1]])
			}
		}
	}
</script>

<style lang="scss" scoped>
	picker-view {
		margin: 0 auto;
		width: 390rpx;
		height: 320rpx;
	}
	.dot{
		font-size: 48rpx;
		font-weight: bold;
		line-height: 320rpx;
	}
	.item {
		font-size: 48rpx;
		font-weight: 500;
		line-height: 40px;
		text-align: center;
	}
</style>
