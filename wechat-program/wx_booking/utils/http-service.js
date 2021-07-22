let BASE_URL = '';

/* Hbuilder 点击运行即生产环境 */
if (process.env.NODE_ENV === 'development') {
	BASE_URL = "https://spa-api.nbmm.co"
}
/* Hbuilder 点击发行即生产环境 */
if (process.env.NODE_ENV === 'production') {
	BASE_URL = "https://spa-api.nbmm.co"
}

export const request = (url, method, data) => {
	// 获取token
	let TOKEN = uni.getStorageSync('userInfo').token
	
	if (url !== '/user/login' && !TOKEN) {
		uni.redirectTo({
			url: '/pages/login/login'
		})
	}

	return new Promise((resolve, reject) => {
		uni.request({
			url: BASE_URL + url,
			method: method || 'GET',
			data: data || {},
			header: {
				"Authorization": TOKEN
			},
			success: ({data}) => {
				if (data.code !== 200) {
					console.log(data.msg)
				}
				if (url !== '/user/login' && data.code === 401){
					uni.redirectTo({
						url:'/pages/login/login'  
					})
				}
				resolve(data)
			},
			fail: (err) => {
				uni.showToast({
					icon: 'none',
					title: '请求失败'
				})
				reject(err)
			}
		})
	})
}
