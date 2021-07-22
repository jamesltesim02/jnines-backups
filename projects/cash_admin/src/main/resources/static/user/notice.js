var vm = new Vue({
    el: '#noticeTable',
    data: {
        noticeList: {},
        userId:'',
        type:-1,
        state:1,
        pageIndex:1,
        pageSize:1,
    },

    methods: {
        login: function () {
            axios({
                method: 'get',
                type: 'json',
                url: 'http://localhost:8080/notice/getNoticeList?userId=' + this.userId + '&type=' + this.type + '&state=' + this.state + '&pageIndex=' + this.pageIndex + '&pageSize=' + this.pageSize
            }).then(function (res) {
                if(res.data.code == 200){
                    vm.noticeList = res.data.data;
                }
            }).catch(function (error) {
                console.log(error);
            })
        }
    },

    mounted:function (){
        this.login();
    }
});