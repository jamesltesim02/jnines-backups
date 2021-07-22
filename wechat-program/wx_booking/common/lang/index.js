import Vue from 'vue'
import VueI18n from 'vue-i18n'

Vue.use(VueI18n)

const i18n = new VueI18n({
	locale: 'zh-CN', // 语言
	messages : {
		'zh-CN': require('./zh.js'),   // 中文
		'en-US': require('./en.js')    // 英文
	}
})

if (navigator.language === 'zh-CN') {
	i18n.locale = 'zh-CN'
}else  {
	i18n.locale = 'en-US'
}

uni.setStorageSync('language',i18n.locale)

export default i18n