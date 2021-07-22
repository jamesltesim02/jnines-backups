var countdown = 0;
function setexpire() {
    countdown = Date.now();
    setTimeout(function () {
        countdown = 0;
    }, 9000);
}

function getexpire() {
    if (!countdown) {
        return false;
    }

    var t = 10 - parseInt((Date.now() - countdown) / 1000);
    var out = t>0 && t<10 ? t : 0;
    if (t<=0) {
        return false;
    } else if (out) {
        $.toast.fail('请等' + out + '秒再试', 1000);
        return true;
    } else if (countdown>0) {
        $.toast.fail('请等10秒再试', 1000);
        return true;
    }
    return false;
}

;(function () {
    Object.assign($, {
        saveComplete: (function () {
            var form;
            function init() {
                var iframe,container;

                container = document.createElement("div");
                container.style.display = "none";

                iframe = document.createElement("iframe");
                iframe.id = iframe.name = "autoComplateFrame";
                iframe.src="#";
                container.appendChild(iframe);
                
                form = document.createElement("form");
                form.action = location.href;
                form.target = "autoComplateFrame";
                container.appendChild(form);

                document.body.appendChild(container);
            }

            function fields2Tags(fields) {
                var key,tags = '';
                if(!fields) {
                    return tags;
                }

                for(key in fields) {
                    tags += '<input type="text" name="' + key + '" value="' + fields[key] + '">';
                }

                return tags;
            }
            return function (fields) {
                if($.appVersion().isIOS) {
                    return;
                }
                if(!form) {
                    init();
                }
                form.innerHTML = fields2Tags(fields);
                form.submit();
            };
        })(),
        getBankIndex: (function () {
            var bankList = {
                '招商银行': 1,
                '广发银行': 2,
                '农业银行': 3,
                '中国建设银行': 4,
                '建设银行': 4,
                '工商银行': 5,
                '中国工商银行': 5,
                '中信银行': 6,
                '徽商银行': 7,
                '上海农商银行': 8,
                '河北银行': 9,
                '民生银行': 10,
                '北京银行': 11,
                '宁波银行': 12,
                '平安银行': 13,
                '渤海银行': 14,
                '浙商银行': 15,
                'BEA东亚银行': 16,
                '浦发银行': 17,
                '交通银行': 18,
                '上海银行': 19,
                '杭州银行': 20,
                '杭州市商业银行': 21,
                '天津银行': 22,
                '中国银行': 23,
                '兴业银行': 24,
                '农村信用合作社': 25,
                '深圳发展银行': 26,
                '中国邮政银行': 27,
                '华夏银行': 28,
                '光大银行': 29
            };

            return function (bankName) {
                var index = bankList[bankName];
                if(index) {
                    return index;
                }

                var key;
                for(key in bankList) {
                    if(key.indexOf(bankName) > -1 || bankName.indexOf(key) > -1) {
                        return bankList[key];
                    }
                }

                return 0;
            }
        })()
    });
})();
