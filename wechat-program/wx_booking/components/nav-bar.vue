<template>
	<view class="nav_bar">
		<u-navbar 
		:is-back="isBack" 
		:border-bottom="false"
		:customBack="customBack"
		>
			<view :class="{pd15:!isBack}">{{text}}</view>
		</u-navbar>
	</view>
</template>

<script>
	export default{
		props:{
			isBack:{
				type: Boolean,
				default: true
			},
			text: {
				type: String,
				default: '',
			},
			customBack: {
				type: Function,
				default: null,
			}
		},
		data(){
			return{
			
			}
		}
	}
</script>

<style lang="scss" scoped>
	.nav_bar{
		font-size: 32rpx;
		font-weight: 500;
		.pd15{
			padding-left: 30rpx;
		}
	}
</style>
