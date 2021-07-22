<template>
	<view class="tips">
		<view class="tips_item">
			1.<text>{{$t('lang.tips.timeOutA')}}</text>
		</view>
		<view class="tips_item">
			2.<text>{{$t('lang.tips.timeOutB')}}</text>
		</view>
	</view>
</template>

<script>
</script>

<style lang="scss" scoped>
	.tips {
		padding: 30rpx 60rpx 0 60rpx;
		font-weight: 600;
		color: #666666;
		text{
			font-size: 26rpx;
			font-weight: normal;
		}
		&_item{
			line-height: 54rpx;
		}
	}
</style>
