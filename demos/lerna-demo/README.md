# 1. lerna
文档: http://dennisgo.cn/Articles/Engineering/mono-repo.html
## 1.1. 全局安装lerna
```bash
npm install -g lerna
```
## 1.2. 使用lerna初始化项目
```bash
lerna init
```
## 1.3. 创建公共子项目
```bash
lerna create common
```
## 1.4. 创建手机站项目
```bash
npx create-react-app mobile --template typescript
```
## 1.5. 创建PC站项目
```bash
npx create-react-app pc  --template typescript
```
## 1.6. 修改各子项目中package.json的name为:
```
@lerna-demo/common
@lerna-demo/mobile
@lerna-demo/pc
```
## 1.7. 删除子项目中的node_modules,并安装到根目录下
```bash
lerna clean
lerna bootstrap --hoist
```
## 1.8. 启动所有子项目命令
```bash
#  在根目录运行
lerna run start
```
## 1.9. 添加脚本,支持单个子项目启动
```json
{
  "scripts": {
    "start": "lerna run start",
    "start:pc": "lerna --scope @lerna-demo/pc run start",
    "start:mobile": "lerna --scope @lerna-demo/mobile run start"
  }
}
```


# TODO
* 离开页面事件超过30分钟,刷新页面
* 离开页面超过3分钟,检查推送消息
* 每次获得焦点都检查推送链接是否健康, 是否需要重连

