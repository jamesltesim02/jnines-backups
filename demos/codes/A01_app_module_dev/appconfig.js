// 当前工作目录(current working directory)
const cwd = (__dirname).replace(/\\/g,'/')

module.exports = {
	// 当前环境类型: dev、pkg_debug、pkg_release、pkg_update
	"env": process.env.NODE_ENV || "dev",
	// 当前产品号
	"product": "a01",
	// 当前工作目录
	"cwd": cwd,
	// 模板配置
	"template": {
		// 打包到app时需要使用到的模板路径
		"app": "_template/apptmpl.app.htm",
		// 开发时运行的模板路径
		"website": "_template/apptmpl.website.htm"
	},
	// 编译入口配置
	"input": {
		// gulp构建入口规则
		"pattern": {
			// js入口
			"js": "./_src/__js/**/*.js",
			// css入口
			"css": "./_src/__css/**/*.*",
			// 图片入口
			"img": "./_src/__static/**/*.*",
			// 业务功能页面入口
			"htm": "./_src/__html/**/*.htm",
			// 配置文件入口
			"config": "./_src/__config/**/*.json",
			// 热更新监听入口路径
		    "watch": "./_src/**/*"
		}
	},
	// 编译出口配置
	"output": {
		// 开发模式出口，针对 npm run dev 命令的配置 ,只在开发分支上有该命令
		"dev": {
			"compress": true,
			// 编译文件输出路径
			"codes": "D:/eclipse-php2/A01_website_bridge/_default"
		},
		// 测试包输出目录, 针对 npm run pkg_debug 命令的配置 ,只在开发分支上有该命令
		"pkg_debug": {
			// 编译文件输出目录
			"codes": "D:/eclipse-php2/A01_website_bridge/_default",
			// 测试包输出目录
			"path": "D:/Hank.A/workspace/st/download",
		},
		// 全量包输出目录, 针对 npm run pkg_release 命令的配置, 只在主干上有该命令
		"pkg_release": {
			// 是否对输出代码进行压缩，可选，默认为false，全量包建议压缩
			"compress": true,
			// 打包后的文件输出目录
			"pushto": "D:/eclipse-php2/A01_mobile/download"
		},
		// 增量包输出目录, 针对 npm run pkg_update 命令的配置, 只在主干上有该命令
		"pkg_update": {
			// 是否对输出代码进行压缩，可选，默认为false，增量包建议压缩
			"compress": true,
			// 打包后的增量包输出目录
			"pushto": "D:/eclipse-php2/A01_mobile/download"
		}
	}
}