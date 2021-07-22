##  推送消息处理
``` javascript
window.dispatchEvent(
  new CustomEvent(
    'push-nt-1001',
    {
      detail: {...data}
    }
  )
)
```


### 监听
``` javascript
window.addEventListener('push-nt-5', (event) => {
  console.log(event);
});
```

## 路由
/detail/xx/:mid
/detail/:mid
