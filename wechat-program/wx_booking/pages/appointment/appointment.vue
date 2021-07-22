<template>
	<view class="appointment">
		<nav-bar 
		:text="$t('lang.appointment.myAppoint')"
		:customBack="backToUser"
		></nav-bar>
		<!-- orderState状态
			 1	已预约
			 2	已取消
			 3	已完成
			 4	已评论
			 5	违约（订单时间三小时内取消订单） -->
			 <!-- 即将开始订单 -->
		<view class="appointment_box">
			<view class="tit" v-if="toBeginList.length > 0">
				{{$t('lang.appointment.aboutToStart')}}
			</view>
			<view class="info" 
			v-for="item in toBeginList"
			:key="item._id"
			@click="goAppointmentDetail(item._id)">
				<view class="toBegin">
					<text class="green">{{formatOrderTime(item.orderTime)}}{{`(${item.clubName[$t("lang.lang")]})`}}</text>
					<text>{{formatOptionItem(item.optionItem)}}</text>
				</view>
				<image src="@/static/image/arrow-right.png"></image>
			</view>
		</view>
		<!-- 历史记录订单 -->
		<view class="appointment_box history" v-if="historyList.length > 0">
			<view class="tit">
				{{$t('lang.appointment.history')}}
			</view>
			<view class="info" 
			v-for="item in historyList" 
			:key="item._id" >
				<view class="info_detial" @click="goAppointmentDetail(item._id)">
					<text>{{formatOrderTime(item.orderTime)}}</text>
					<text class="gray">{{formatOptionItem(item.optionItem)}}</text>
				</view>
				<view 
				:class="[item.orderState == 3 ? 'green':'gray']" 
				@click="item.orderState == 3 && evaluate(item._id)">
					{{formatOrderState(item.orderState)}}
				</view>
			</view>
		</view>
		<appointment-evaluate ref='evaluate' :orderId = 'currentOrderId'></appointment-evaluate>
		<u-empty class="empty" mode="history" :text="$t('lang.appointment.noHistory')" v-if="orderList.length === 0"></u-empty>
	</view>
</template>

<script>
	import appointmentEvaluate from './components/appointment-evaluate.vue'
	
	export default {
		components:{
			appointmentEvaluate,
		},
		data() {
			return {
				orderList: [],
				currentOrderId: '',
        userInfo: {}
			}
		},
    onShow () {
		  this.userInfo = uni.getStorageSync('userInfo')
    },
		computed:{
			toBeginList() {
				return this.orderList.filter(i=>i&&i.orderState === 1)
			},
			historyList() {
				return this.orderList.filter(i=>i&&i.orderState !== 1)
			},
			i18n() {
				return this.$t('lang.appointment')
			}
		},
		created() {
			this.getUserOrder()
		},
		methods: {
			// 评分
			evaluate(orderId) {
				// 打开评分窗口
				this.$refs.evaluate.showEvaluate = true
				this.currentOrderId = orderId
			},
			// 返回首页
			backToUser () {
				uni.reLaunch({
					url: '../user/user'
				})
			},
			// 获取用户订单
			async getUserOrder() {
				let query = {
					userId: this.userInfo._id,
					vipAccount: this.userInfo.vipAccount,
					pageSize: 50,
					pageIndex: 1
				}
				const {data} = await this.$api.userOrder(query)
				this.orderList = data.list
			},
			// 查看订单详情
			goAppointmentDetail(orderId) {
				uni.navigateTo({
					url:'../appointment-detail/appointment-detail?orderId=' + orderId
				})
			},
			// 时间格式
			formatOrderTime(val){
				const time = new Date(val)
				if(time.toDateString() === new Date().toDateString()){
					return this.$t('lang.time.today') + ' ' + time.toLocaleTimeString().slice(0,-3)
				}else{
					return `${time.toLocaleString(this.$t('lang.langName'),{hour12: false}).slice(0,-3)}`
				}
			},
			// 项目格式
			formatOptionItem(val) {
				return val.map(item=>item.itemName[this.$t('lang.lang')]).join('、')
			},
			// 历史记录操作
			formatOrderState(val) {
				let str = ''
				switch(val) {
					case 2 :
					str = this.i18n.cancelled;
					break;
					case 3 :
					str = this.i18n.Evaluation;
					break;
					case 4 :
					 str = this.i18n.Evaluated;
					 break;
					case 5 : 
					str =  this.i18n.breakContract;
					break;
				}
				return str
			}
		}
	}
</script>

<style lang="scss" scoped>
.appointment{
	
	.tit{
		font-size: 36rpx;
		font-weight: 500;
		line-height: 60rpx;
		margin: 30rpx 0;
	}
	.appointment_box{
		margin: 0 auto;
		width: 630rpx;
		&.history{
			margin-top: 100rpx;
		}
		.info{
			height: 160rpx;
			border-bottom: 1px solid #DDDDDD;
			display: flex;
			justify-content: space-between;
			align-items: center;
			.info_detial,.toBegin{
				text{
					display: block;
					line-height: 54rpx;
					font-size: 28rpx;
				}
			}
			.info_detial{
				width: 500rpx;
				text:first-child{
					font-size: 32rpx;
					font-weight: 500;
				}
			}
			.toBegin{
				text:first-child{
					font-size: 36rpx;
					font-weight: 500;
				}
			}
		}
		image{
			width: 32rpx;
			height: 32rpx;
		}
	}
}
</style>
