(function () {
  // 获取head标签
  const headTag = document.querySelector('head')
  const tag = document.querySelector('script[src*="widgetloader.js"]');
  if (!tag) {
    return;
  }

  const scriptURL = new URL(tag.src);
  const baseURL = `${scriptURL.protocol}//${scriptURL.host}/`;

  var fid = 'default';
  // 获取域名的第一段
  var domainName = window.location.hostname.split('.')[0];
  // 判断是否是第三方商户
  if (/^(smart|10077)m?\d{5}$/i.test(domainName)) {
    fid = domainName.substr(-5);
  }

  // 执行加载文件, 并执行初始化函数
  Promise.all(
    [
      loadStatic('js', 'configs/config.' + fid + '.js')
    ]
  ).then(
    () => { 
      const J9Sport = {
        available: true,
        addWidget (wName, settings) {
          console.log('receive add widget event.');
          if (!settings.el) {
            throw Error('参数 el 不能为空, 请传入用于显示组件的容器选择器值, 如: #qbContainer');
          }
          const container = document.querySelector(settings.el);

          if (!container) {
            throw Error('容器未找到,请检查 el 参数');
          }

          const qbEl = document.createElement('div');

          qbEl.style.height = '300px';
          qbEl.style.padding = '30px';

          if (!settings.j9Token) {
            const signButton = document.createElement('button');
            signButton.innerHTML = '测试登录事件';
            signButton.addEventListener('click', () => {
              if(settings.on?.signRequest) {
                settings.on.signRequest((newToken) => {
                  console.log('新Token为:', newToken)
                });
              }
            })
            qbEl.appendChild(signButton);
          } else {
            const rechargeButton = document.createElement('button');
            rechargeButton.innerHTML = '测试充值';
            rechargeButton.addEventListener('click', settings.on?.rechargeRequest)
            qbEl.appendChild(rechargeButton);
  
            const betButton = document.createElement('button');
            betButton.innerHTML = '测试投注';
            betButton.addEventListener('click', settings.on?.betFinished)
            qbEl.appendChild(betButton);
          }

          container.appendChild(qbEl);

          if (settings.on && settings.on.widgetReady) {
            settings.on.widgetReady();
          }
        }
      };
      window.J9Sport = J9Sport;
      window.dispatchEvent(new Event('J9SportReady'))
    }
  ).catch(
    err => console.error(err)
  )
})();
