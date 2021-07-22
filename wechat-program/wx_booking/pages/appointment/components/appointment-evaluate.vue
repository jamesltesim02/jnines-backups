<template>
	<view class="evaluate">
		<u-popup v-model="showEvaluate" mode="bottom" closeable width="100%" height="764" close-icon-pos="top-left">
			<view class="tit">{{$t('lang.evaluate.perform')}}</view>
			<view class="rate">
				<view class="rate_text">
					{{rateText}}
				</view>
				<!-- 选择评分 -->
				<view class="star">
					<view class="star_item" 
					v-for="(item,index) in rateDesc" @click="clickStar(index)">
						<image :src="`../../static/image/${index <= rate?'star_green':'star_grey'}.png`" mode=""></image>
					</view>
				</view>
			</view>
			<!-- 备注栏 -->
			<textarea class="note" v-model="note" :placeholder="$t('lang.evaluate.notePlaceholder')" />
			<!-- 提交 -->
			<i-footer :isBack='false'>
				<view @click="submitEvaluate">
					{{$t('lang.evaluate.submit')}}
				</view>
			</i-footer>
		</u-popup>
		<u-toast ref='uToast'></u-toast>
	</view>
</template>

<script>
	export default {
		data() {
			return {
				showEvaluate: false,
				rate: 2,
				rateDesc: ['很差','比较差','一般','很好','非常好'],
				note:''
			}
		},
		props:['orderId'],
		computed:{
			rateText(){
				return this.rateDesc[this.rate]
			}
		},
		methods:{
			clickStar(index){
				this.rate = index
			},
			// 提交评分
			async submitEvaluate(orderId) {
				let param = {
					orderId: this.orderId,
					score: this.rate,
					remark: this.note
				}
				const {data} = await this.$api.gradeOrder(param)
				if(data.code !== 200){
					this.$refs.uToast.show({
						title: data.msg,
						type: 'default'
					})
				}else{
					this.$refs.uToast.show({
						title: this.$t('lang.evaluate.success'),
						type: 'default',
						duration: 1000,
						callback () {
							uni.redirectTo({
								url: '/pages/appointment/appointment'
							})
						}
					})
				}
			}
		}
	}
</script>

<style lang="scss" scoped>
	.evaluate {
		.tit {
			font-size: 32rpx;
			font-weight: 500;
			line-height: 88rpx;
			text-align: center;
		}

		.rate {
			text-align: center;
			padding-top: 20rpx;
			margin-bottom: 60rpx;
			.rate_text{
				font-size: 28rpx;
				color: #666666;
				line-height: 100rpx;
			}
			.star {
				width: 510rpx;
				display: inline-flex;
				justify-content: space-evenly;
				.star_item {
					width: 70rpx;
					height: 70rpx;
					image {
						width: 100%;
						height: 96%;
					}
				}
			}
		}
		.note{
			box-sizing: border-box;
			width: 630rpx;
			height: 200rpx;
			margin: 0 auto;
			border: 1px solid #CCCCCC;
			box-shadow: 0 2px 4px 0 rgba(0,0,0,0.08);
			border-radius: 6px;
			padding: 30rpx;
		}
	}
</style>
