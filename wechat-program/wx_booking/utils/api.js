import {
	request
} from './http-service.js'

export const api = {
	// 用户登录
	userLogin(param) {return request('/user/login','post',param)}, 
	// 获取首页会所列表 
	getHomeInfo() {return request('/home/homeInfo')},
	// 获取会所技师列表
	getTechnician(query) {return request('/worker/workerList','get',query) },
	// 获取服务项目列表
	getItemList(query) {return request('/item/itemList','get',query) },
	// 下单
	placeOrder(param) {return request('/order/placeOrder','post',param)},
	// 订单查询
	userOrder(query) {return request('/order/userOrders','get',query)},
	// 订单详情
	orderDetails(query) {return request('/order/orderDetails','get',query)},
	// 订单评分
	gradeOrder(param) {return request('/order/gradeOrder','post',param)},
	// 订单取消
	cancelOrder(param) {return request('/order/cancelOrder','post',param)},
	// 订单修改
	updateOrder(param) {return request('/order/updateOrder','post',param)}
}
