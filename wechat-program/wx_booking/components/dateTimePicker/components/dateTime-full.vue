<template>
	<view class="full">
		<u-popup v-model="showFull" mode="bottom" closeable width="100%" :height="isChange?'650':'1000'" close-icon-pos="top-left">
			<view class="tit">来晚了，此时段已约满</view>
			<image v-if="!isChange" class="fullBanner" src="@/static/image/img_fully_booked.png"></image>
			<view class="confirm">
				<text>{{isChange?'您可选择下列可用时段':'✨不要慌，您仍可选择下列可用时段✨'}}</text>
				<view class="confirm_time">
					21:00 - 18:00
				</view>
				<view class="confirm_time confirm_time-selected">
					22:00 - 24:00
				</view>
			</view>
			<i-footer :isBack='false'>
				<view>
					立即预约
				</view>
			</i-footer>
		</u-popup>
	</view>
</template>

<script>
	export default {
		props:['isChange'],
		data() {
			return {
				showFull: false
			}
		}
	}
</script>

<style lang="scss" scoped>
	.full {
		.tit{
			font-size: 32rpx;
			font-weight: 500;
			line-height: 88rpx;
			text-align: center;
		}
		.fullBanner{
			width: 100%;
			height: 360rpx;
		}
		.confirm{
			margin-top: 30rpx;
			display: flex;
			text-align: center;
			flex-direction: column;
			align-items: center;
			&_time{
				width: 630rpx;
				height: 100rpx;
				line-height: 100rpx;
				background-color: #EEEEEE;
				font-size: 36rpx;
				font-weight: 500;
				margin-top: 30rpx;
				border-radius: 6px;
				&-selected{
					border: 3rpx solid $uni-bg-color;
					background-color: #FFFFFF;
				}
			}
			
		}
	}
</style>
