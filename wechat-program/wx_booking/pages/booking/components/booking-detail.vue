<template>
	<view class="booking_detail">
		<text>{{$t('lang.booking.guests') + num}}</text>
		<view class="detail_box">
			<!-- 选择项目 -->
			<hover-view>
				<view class="detail_item" @click="showPopup(800,'type',num)">
					{{itemName[$t('lang.lang')]||$t('lang.booking.selectItem')}}
				</view>
			</hover-view>
			<!-- 偏好 -->
			<hover-view>
				<view 
				class="detail_item" 
				@click="showPopup(1200,'technician',num)"
				>
					{{
						workerName[$t('lang.lang')] || 
						preference ||
						$t('lang.booking.preference')
					}}
				</view>
			</hover-view>
		</view>
		<!-- 具体项目弹出层 -->
		<u-popup 
		v-model="popUp.show" 
		mode="bottom" 
		closeable 
		width="100%" 
		:height="popUp.height+'rpx'" 
		close-icon-pos="top-left"> 
			<!-- 项目选择 -->
			<booking-type 
			v-if="popUp.type === 'type'" 
			@selected='selectedType'
			:itemList='itemList'>
			</booking-type>
			
			<!-- 技师选择 -->
			<booking-technician 
			v-else-if="popUp.type === 'technician'" 
			@selected='selectedTechnician'
			:techList='techList'>
			</booking-technician>
		</u-popup>
	</view>
</template>

<script>
	import bookingType from './booking-type.vue'
	import bookingTechnician from './booking-technician.vue'
	
	export default{
		components:{
			bookingType,
			bookingTechnician
		},
		props:['num','techList','itemList'],
		data() {
			return {
				popUp: {
					show: false,
					height: 800,
					type: ''
				},
				workerName: '', 
				workerId: '',   
				itemId: '',
				itemName: '',
				itemMinute: 0,  
				itemPrice: 0,
				preference: ''
			}
		},
		computed:{
			optionItem() {
				return {
					itemId: this.itemId,
					itemName: this.itemName,
					itemMinute: this.itemMinute,
					itemPrice: this.itemPrice,
					workerId: this.workerId,
					preference: this.preference
				}
			}
		},
		methods:{
			showPopup(height,type){
				this.popUp = {height,type,show:true}
			},
			// 已选技师/标签
			selectedTechnician(preference,id) {
				this.preference = preference || ''
				this.workerId = id || ''
				this.popUp.show = false
			},
			// 已选项目
			selectedType(id,name,min,price) {
				this.itemId = id || ''
				this.itemName = name 
				this.itemMinute = min
				this.itemPrice = price
				this.popUp.show = false
			}
		}
	}
</script>

<style lang="scss" scoped>
	.booking_detail {
		height: 308rpx;
		width: 630rpx;
		border-top: 1px solid #DDDDDD;
		font-size: 36rpx;
		font-weight: 500;
		display: flex;
		flex-direction: column;
		justify-content: space-evenly;
		.detail_box {
			display: flex;
			justify-content: space-between;
			.detail_item {
				width: 300rpx;
				line-height: 100rpx;
				border: 1px solid #CCCCCC;
				box-shadow: 0 2px 4px 0 rgba(0, 0, 0, 0.08);
				border-radius: 12rpx;
				font-size: 32rpx;
				font-weight: 400;
				color: #666666;
				padding-left: 30rpx;
			}
		}
	
	}
</style>
