<template>
	<view class="share">
		<u-popup v-model="showShare" mode="bottom" width="100%" height="314">
			<view class="share_box">
				<!-- 分享按钮,微信小程序需要设open-type属性 -->
				<button hover-class='none' open-type="share" class="share_box_item">
					{{$t('lang.share.wechat')}}
				</button>
				<view class="share_box_item">
					{{$t('lang.share.image')}}
				</view>
				<view class="line"></view>
				<view class="share_box_item" @click=" showShare= false">
					{{$t('lang.common.cancle')}}
				</view>
			</view>
		</u-popup>
	</view>
</template>

<script>
	export default {
		data() {
			return {
				showShare: false
			}
		},
		// 分享
		onShareAppMessage(res) {
			return {
				title: 'SPA',
				path: 'pages/index/index'
			}
		}
	}
</script>

<style lang="scss" scoped>
	.share {
		&_box {
			display: flex;
			flex-direction: column;

			button {
				background-color: #FFFFFF;
				width: 100%;

				&::after {
					border: none;
				}
			}

			&_item {
				line-height: 100rpx;
				font-size: 36rpx;
				text-align: center;

				&:first-child {
					border-bottom: 1px solid #E1E1E6;
				}
			}

			.line {
				height: 12rpx;
				background-color: #E1E1E6;
			}
		}
	}
</style>
