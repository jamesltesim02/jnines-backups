# 搭建过程  
[搭建过程文档](./docs/create-app-guide.md)

### 主站接入时跳转地址
https://web.j9sport.com/?token=BC4284A033674EF0F661CB0566B22100C2DFA20C9DBE6CFB84C5EC4F843093C849C9B5141E2B5FE966CFA7A6A7D7BA1E&clientType=1&origin=http://m.j92016.com
https://web.j9sport.com/?token=BC4284A033674EF0F661CB0566B22100C2DFA20C9DBE6CFB84C5EC4F843093C89E172A6B6D4A6EEF04009713D0223DAA&clientType=2&origin=http://j92016.com

## 推送模板  
### nt7 比分变化 
```json
{
	"nt":7,
	"ts": 1231654,
	"data":{
		"mid": "184249909903360",
		"spid": 10,
		"etype": 1,
		"score": "1:1",
		"gameScore": "",
		"setScore": ""
	}
}
```
### nt5 拉盘
```json
{
	"nt":5,
	"ts": 12345644,
	"data": {
		"mid": "",
		"spid": 10
	}
}
```

### nt1001 开始发红包
```json
{
	"nt": 1001,
	"ts": 123121,
	"data": {
		"actId": "111",
		"matchId": "186232136433664",
		"matchName": "aaa",
		"tourName": "bbbb",
		"redType": 1,
		"actionTime": 45454,
		"activeTime": 1000,
		"score": "1:1",
		"count": 200,
		"amount": 200
 	}
}
```


### 配置文件 

	1. configs目录下除index.ts.sample之外的其他文件删除
	2. mv index.ts.sample index.ts
	3. 将对应URL修改配置

{
	"code": 200,
	"data": {
			"maintenance": false,
			"maintenancetime": null
	},
	"msg": "oddin"
}

j9, saba  ysb, oddin
