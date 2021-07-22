import {getLanguage, setLanguage} from '@/utils/LanguageUtils'
import {callUnLogin, callBetSuccess} from '@/utils/ClientAdapter'

export default {
  data () {
    return {
      language: getLanguage(),
      leagues: []
    }
  },
  watch: {
    language (n) {
      setLanguage(n)
      this.$i18nAsync(n)
    }
  },
  created () {
    this.initData()
  },
  methods: {
    toastMessage () {
      this.$toast('default message')
    },
    toastLoading () {
      this.$loading('loading...')
      setTimeout(() => {
        this.$loading.close()
      }, 3000)
    },
    toastTopMessage () {
      this.$toast.top('top message')
    },
    toastCenterMessage () {
      this.$toast.center('center message')
    },
    toastBottomMessage () {
      this.$toast.bottom('bottom message')
    },
    async initData () {
      let data = await this.$api.matchs.bgroups()
      this.leagues = data.groups
    },
    async checkLogin () {
      try {
        let loginInfo = await callUnLogin()
        console.log(loginInfo)
      } catch (e) {
        console.log('error')
      } finally {
        console.log('finally............')
      }
    },
    betting () {
      callBetSuccess({
        amount: 10,
        name: 'hehehe'
      })
    }
  }
}
