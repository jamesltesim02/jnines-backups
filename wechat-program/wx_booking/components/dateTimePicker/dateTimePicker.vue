<template>
	<view class="dataTime">
		<view class="dateTime_container">
			<!-- 日期选择 -->
			<view class="date">
				<view class="tit">{{$t('lang.common.date')}}</view>
				<view class="date_tab" @click="showCalender">
					<image src="@/static/image/icon_calendar.png"></image>
					<text>{{week||$t('lang.time.today')}}</text>
				</view>
			</view>
			<!-- 时间选择 -->
			<view class="time">
				<view class="tit">{{$t('lang.common.time')}}</view>
				<view class="time_box">
					<view class="time_tab">
						<image src="@/static/image/icon_clock.png"></image>
						<text>{{hour + ':' + minutes}}</text>
						<date-time-picker @timeChange='timeChange'></date-time-picker>
					</view>
				</view>
			</view>
		</view>
		<!-- popup组件 -->
		<date-time-calender @getDate='getDate' ref='dateTimeCalenderShow'></date-time-calender>
		<date-time-available :isChange='isChange' ref='available'></date-time-available>
		<date-time-full :isChange='isChange'></date-time-full>
	</view>
</template>

<script>
	import dateTimePicker from './components/dateTime-picker.vue'
	import dateTimeCalender from './components/dateTime-calender.vue'
	import dateTimeAvailable from './components/dateTime-Available.vue'
	import dateTimeFull from './components/dateTime-full.vue'
	
	export default {
		components:{
			dateTimePicker,
			dateTimeCalender,
			dateTimeAvailable,
			dateTimeFull
		},
		props:{
			isChange:{
				type: [Boolean,String],
				default: false
			}
		},
		data() {
			return{
				year: '',
				month: '',
				day: '',
				hour: '',
				minutes: '',
				week: '',
			}
		},
		computed:{
			// 预约时间
			appointmentTime() {
				return `${this.year}-${this.month}-${this.day} ${this.hour}:${this.minutes}:00`
			}
		},
		created() {
			this.int()
		},
		methods: {
			int() {
				const now = new Date()
				this.year = now.getFullYear()
				this.month = now.getMonth() + 1
				this.day = now.getDate()
			},
			// 取得选择的时间
			timeChange(hour,min) {
				this.hour = hour
				this.minutes = min
			},
			showCalender() {
				this.$refs.dateTimeCalenderShow.showCalender = true
			},
			// 取得选择日期
			getDate(year,month,day,week) {
				this.year = year
				this.month = month
				this.day = day
				if (new Date().getFullYear() < year){
					this.week = `${year}-${week}`
				}else{
					this.week = week
				}
			},
			back(){
				uni.navigateBack()
			},
		}
	}
</script>

<style lang="scss" scoped>
	.dataTime {
		.dateTime_container{
			padding: 60rpx 60rpx;
		}
		.tit {
			font-size: 36rpx;
			font-weight: 500;
		}

		.time {
			margin-top: 60rpx;
			padding-top: 60rpx;
			border-top: 1px solid #DDDDDD;

			&_box {
				margin-top: 30rpx;
				height: 460rpx;
				border-radius: 6px;
				border: 1px solid #CCCCCC;
			}

			&_tab {
				border-bottom: 1px solid #DDDDDD;
			}
		}

		.date_tab,
		.time_tab {
			padding-left: 34rpx;
			width: 628rpx;
			height: 100rpx;
			line-height: 100rpx;
			image {
				width: 44rpx;
				height: 44rpx;
			}
			text{
				font-size: 32rpx;
				color: #333333;
				font-weight: 500;
				vertical-align: super;
				padding-left: 30rpx;
			}
		}

		.date_tab {
			margin-top: 30rpx;
			border: 1px solid #CCCCCC;
			box-shadow: 0 2px 4px 0 rgba(0, 0, 0, 0.08);
			border-radius: 6px;
		}
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
			}
			.btn_gray{
				width: 210rpx;
			}
		}

	}
</style>
