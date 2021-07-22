<template>
	<view class="appointment-detail">
		<nav-bar :text="$t('lang.appointDetail.detail')"></nav-bar>
		<!-- 时间和店名 -->
		<view class="tit" v-if="orderDetails.orderTime">
			{{formatOrderTime(orderDetails.orderTime)}} {{`(${orderDetails.clubName[$t('lang.lang')]})`}}
		</view>
		<!-- 客人详细项目 -->
		<view class="detail_box">
			<view class="detail_item"
            v-for="(item,index) in orderDetails.optionItem"
            :key="index"
      >
				<view class="detail_item_tit">
					{{$t('lang.appointDetail.guests')}}{{index+1}}
				</view>
				<!-- 技师偏好 -->
				<view class="detail_item_info">
					<text>{{$t('lang.appointDetail.preference')}}</text>
					<text>{{item.workerName && item.workerName[$t('lang.lang')]||$t('lang.common.none')}}</text>
				</view>
				<!-- 项目 -->
				<view class="detail_item_info">
					<text>{{$t('lang.appointDetail.project')}}</text>
					<text>{{item.itemName[$t('lang.lang')]}}</text>
				</view>
			</view>
		</view>
		<!-- 温馨提示 -->
		<tips></tips>
		<!-- state:1为可以取消和更改的状态 -->
		<view class="footer" v-if="orderDetails.orderState === 1">
			<button class="btn_red" @click="showCanclePopup = true">{{$t('lang.appointDetail.cancleAppoint')}}</button>
			<button class="btn_gray" @click="goDateTime">{{$t('lang.appointDetail.changeAppoint')}}</button>
		</view>
		<!--  取消预约弹窗 -->
		<u-popup 
		v-model="showCanclePopup" 
		mode="center" 
		width="600" 
		height="450" 
		border-radius="10">
		<view class="canclePopup">
			<text>{{$t('lang.appointDetail.threeHours')}}</text>
			<button class="btn_red" @click="cancleOrder">{{$t('lang.appointDetail.continueCanecle')}}</button>
			<button class="btn_gray" @click="showCanclePopup = false">{{$t('lang.common.back')}}</button>
		</view>
		</u-popup>
		<u-toast ref='uToast'></u-toast>
	</view>
</template>

<script>
	export default {
		data() {
			return {
				orderId: '',
				orderDetails: {},
				showCanclePopup: false
			}
		},
		onLoad(option) {
			this.orderId = option.orderId
		},
		mounted() {
			this.getOrderDetail()
		},
		methods: {
			goDateTime() {
				const query = {
					change: true,
					clubName: this.orderDetails.clubName,
					clubId: this.orderDetails.clubId,
					orderId: this.orderDetails._id
				}
				
				uni.navigateTo({
					url:`../dateTime/dateTime?query=${encodeURIComponent(JSON.stringify(query))}`
				})
			},
			// 获取订单详情
			async getOrderDetail() {
				const {data} = await this.$api.orderDetails({orderId:this.orderId})
				this.orderDetails = data
			},
			// 取消订单
			async cancleOrder() {
			const res =await this.$api.cancelOrder({orderId:this.orderId})
			if( res.code !== 200){
				this.$refs.uToast.show({
					title: res.msg,
					type: 'default'
				})
			}else{
				this.showCanclePopup = false
				// 订单已取消
				this.$refs.uToast.show({
					title: this.$t('lang.appointDetail.orderCancelled'),
					type: 'default',
					duration: 1000,
					url: '/pages/appointment/appointment'
				})
			  }
			},
			formatOrderTime(val){
				const time = new Date(val)
				if(time.toDateString() === new Date().toDateString()){
					return this.$t('lang.time.today') + ' ' + time.toLocaleTimeString().slice(0,-3)
				}else{
					return `${time.toLocaleString(this.$t('lang.langName'),{hour12: false}).slice(0,-3)}`
				}
			},
		}
	}
</script>

<style lang="scss" scoped>
.appointment-detail{
	padding-bottom: 150rpx;
	.tit{
		font-size: 36rpx;
		font-weight: 500;
		line-height: 136rpx;
		border-bottom: 1px solid #DDDDDD;
	}
	.detail_box,.tit{
		width: 630rpx;
		margin: 0 auto;
	}
	.detail_box,.detail_item{
		display: flex;
		flex-direction: column;
	}
	.detail_item{
		justify-content: center;
		height: 240rpx;
		width: 630rpx;
		border-bottom: 1px solid #DDDDDD;
		&_tit{
			font-size: 36rpx;
			line-height: 60rpx;
			margin-bottom: 10px;
		}
		&_info{
			font-size: 28rpx;
			color: #333333;
			line-height: 50rpx;
			text:first-child{
				width: 160rpx;
				display: inline-block;
			}
		}
	}
	.footer{
		position: fixed;
		bottom: 0;
		padding: 30rpx 0;
		width: 750rpx;
		display: flex;
		font-size: 32rpx;
		font-weight: 500;
		background-color: #FFFFFF;
		.btn_red{
			width: 210rpx;
		}
		.btn_gray{
			width: 450rpx;
		}
	}
	.canclePopup{
		padding: 50rpx 30rpx;
		text{
			font-size: 16px;
			color: #333333;
		}
		button{
			margin-top: 20rpx;
			font-size: 32rpx;
		}
	}
}
</style>
