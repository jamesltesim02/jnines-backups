<template>
	<!-- 日历组件 -->
	<view class="calender">
		<u-popup v-model="showCalender" mode="bottom" closeable width="100%" height="1100" close-icon-pos="top-left">
			<view class="calender_container">
				<view class="header">
					<view class="tit">
						{{tit}}
					</view>
					<!-- 星期 -->
					<view class="week">
						<text v-for="item in week" :key='item'>{{item}}</text>
					</view>
				</view>
				<view class="content" v-for="(itemx, index) in dateArr" :key="index">
					<view class="content_year">{{itemx.title}}</view>
					<view class="content_day">
						<view 
						:class="[
						'day_item',
						(index === 0 && indey <= today) && 'day_item-unable',
						(index === 0 && indey === today + 1) && 'day_item-today',
						(itemx.year === selectYear && itemx.month === selectMonth && itemy === selectDay) && 'day_item-selected'
						]" 
						v-for="(itemy,indey) in itemx.daysArr"
						:key='indey'
						@click=" (index === 0 && indey <= today) || itemy =='' || handleSelectDay(itemx.year,itemx.month,itemy)">{{itemy}}</view>
						<!-- <view class="day_item day_item-selected" >2</view> -->
					</view>
				</view>
				<view class="footer" @click="sendDate">
					{{$t('lang.common.confirm')}}
				</view>
			</view>
		</u-popup>
	</view>
</template>

<script>
	export default {
		data() {
			return {
				showCalender: false,
				year: 2020,
				month: 0,
				today: 0,
				selectYear: 0,
				selectMonth: 0,
				selectDay: 0,
				selectWeek: '',
				week: this.$t('lang.calender.week'),
				weekZh : this.$t('lang.calender.weekZh'),
				dateArr: []
			}
		},
		mounted() {
			this.int()
		},
		computed:{
			tit () {
				return `${this.selectMonth}-${this.selectDay}  ${this.selectWeek}` 
			}
		},
		methods: {
			int() {
				this.getDate()
				this.handleDateArr()
				this.handleSelectDay(this.year,this.month,this.today)
			},
			//一个月有多少天
			getMonthDay(year, month) {
				let days = new Date(year, month, 0).getDate();
				return days;
			},
			// 1号是星期几
			getWeekday(year, month) {
				let date = new Date(`${year}/${month}/01 00:00:00`);
				return date.getDay();
			},
			// 当前年份和月份
			getDate() {
				const now = new Date()
				this.year = now.getFullYear()
				this.month = now.getMonth() + 1
				this.today = now.getDate()
			},
			// 获取当前月
			getEachDate(year, month) {
				// 前面空白部分
				let daysArr = Array(this.getWeekday(year, month)).fill('')
				// 日期
				for (let i = 1; i <= this.getMonthDay(year, month); i++) {
					daysArr.push(i)
				}
				return {
					title: `${year}-${month}`,
					year,
					month,
					daysArr,
				}
			},
			// 生成的月份数
			handleDateArr(times = 12) {
				for (let i = 0; i < times; i++) {
					let _year = this.year
					let _month = this.month + i
					
					if (_month > 12){
						_year ++;
						_month -= 12
					}
					this.dateArr.push(this.getEachDate(_year, _month))
				}
			},
			// 点击日期
			handleSelectDay(year,month,day) {
				this.selectMonth = month
				this.selectYear = year
				this.selectDay = day
				this.selectWeek = this.weekZh[new Date(`${year}/${month}/${day}`).getDay()]
			},
			sendDate() {
				this.$emit('getDate',this.selectYear,this.selectMonth,this.selectDay,this.tit)
				this.showCalender = false
			}

		}
	}
</script>

<style lang="scss" scoped>
	.calender {
		&_container {	
			.header {
				background-color: #FFFFFF;
				position: sticky;
				width: 100%;
				top: 0;
				padding-top: 96rpx;
				z-index: 2;
				.tit{
					line-height: 80rpx;
					font-size: 36rpx;
					font-weight: 500;
					border-bottom: 1px solid #CCCCCC;
					padding-left: 40rpx;
				}
				.week {
					width: 670rpx;
					margin: 0 auto;
					display: flex;
					font-size: 26rpx;
					color: #666666;
					line-height: 88rpx;
				
					text {
						text-align: center;
						flex: 1;
					}
				}
			}

			.footer {
				background-color: #FFFFFF;
				width: 100%;
				height: 96rpx;
				line-height: 96rpx;
				text-align: center;
				color: #77B300;
				font-size: 32rpx;
				font-weight: 500;
				box-shadow: 0 -2px 4px 0 rgba(0, 0, 0, 0.08);
				position: sticky;
				bottom: 0;
			}

			.content {
				width: 670rpx;
				margin: 0 auto;

				&_year {
					font-size: 30rpx;
					color: #333333;
					padding-left: 20rpx;
					line-height: 88rpx;
				}

				&_day {
					display: flex;
					flex-wrap: wrap;

					.day_item {
						text-align: center;
						line-height: 88rpx;
						flex: 0 0 14.25%;
						font-size: 30rpx;
						font-weight: 500;
						&-unable {
							color: #CCCCCC;
						}
						&-today{
							position: relative;		
							&::after {
								content: '';
								position: absolute;
								z-index: -1;
								left: 50%;
								top: 50%;
								transform: translate(-50%, -50%);
								width: 70rpx;
								height: 70rpx;
								border: 1px solid #CCCCCC;
								border-radius: 50%;
							}
						}
						&-selected {
							position: relative;
							color: #FFFFFF;
							&::after {
								content: '';
								position: absolute;
								z-index: -1;
								left: 50%;
								top: 50%;
								transform: translate(-50%, -50%);
								width: 70rpx;
								height: 70rpx;
								background-color: $uni-bg-color;
								border-radius: 50%;
							}
						}

					}
				}
			}

		}
	}
</style>
