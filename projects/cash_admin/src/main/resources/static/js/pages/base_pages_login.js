/*
 *  Document   : base_pages_login.js
 *  Author     : pixelcave
 *  Description: Custom JS code used in Login Page
 */

var BasePagesLogin = function() {
    // Init Login Form Validation, for more examples you can check out https://github.com/jzaefferer/jquery-validation
    var initValidationLogin = function(){
        jQuery('.js-validation-login').validate({
            errorClass: 'help-block text-right animated fadeInDown',
            errorElement: 'div',
            errorPlacement: function(error, e) {
                jQuery(e).parents('.form-group > div').append(error);
            },
            highlight: function(e) {
                jQuery(e).closest('.form-group').removeClass('has-error').addClass('has-error');
                jQuery(e).closest('.help-block').remove();
            },
            success: function(e) {
                jQuery(e).closest('.form-group').removeClass('has-error');
                jQuery(e).closest('.help-block').remove();
            },
            rules: {
                'login-username': {
                    required: true,
                    minlength: 3
                },
                'login-password': {
                    required: true,
                    minlength: 5
                }
            },
            messages: {
                'login-username': {
                    required: 'Please enter a username',
                    minlength: 'Your username must consist of at least 3 characters'
                },
                'login-password': {
                    required: 'Please provide a password',
                    minlength: 'Your password must be at least 5 characters long'
                }
            }
        });
    };

    return {
        init: function () {
            // Init Login Form Validation
            initValidationLogin();
        }
    };
}();

var vm = new Vue({
    el: '#app_login',
    data: {
        userName: "",
        passWord: ""
    },
    methods: {
        login: function () {
            axios({
                method: 'post',
                type: 'json',
                url: 'http://localhost:8080/login/login',
                data: {
                    userName: this.userName,
                    passWord: this.passWord
                }
            }).then(function (res) {
                if(res.data.code == 200){
                    window.location.href='http://localhost:8080/index/main';
                }
            }).catch(function (error) {
                console.log(error);
            })
        }
    }
});

// Initialize when page loads
//jQuery(function(){ BasePagesLogin.init(); });