<template>
	<view class="footer">
		<hover-view v-if='isBack'>
			<button class="btn_gray" @click="back">{{$t('lang.common.back')}}</button>
		</hover-view>
		<hover-view>
			<view :class="[isBack ? 'btn_green':'btn_green btn_green-full']" >
				<slot></slot>
			</view>
		</hover-view>
	</view>
</template>

<script>
	export default {
		props:{
			isBack: {
				type: Boolean,
				default: true
			},
			nextText: {
				type: String,
				default: '下一步',
			},
		},
		methods:{
			back(){
				uni.navigateBack()
			},
		}
	}
</script>

<style lang="scss" scoped>
	.footer {
		height: 160rpx;
		width: 100%;
		background-color: #FFFFFF;
		box-shadow: 0 -2px 4px 0 rgba(0, 0, 0, 0.08);
		position: fixed;
		bottom: 0;
		z-index: 9;
		display: flex;
		justify-content: space-evenly;
		align-items: center;
		.btn_green{
			width: 450rpx;
			&-full{
				width: 690rpx;
			}
		}
		.btn_gray{
			width: 210rpx;
		}
	}
</style>
