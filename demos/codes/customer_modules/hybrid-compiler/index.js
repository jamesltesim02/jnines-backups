const through  = require("through2")
const Compiler = require('./lib/Compiler')
const minify = require('html-minifier').minify

/**
 *  编译入口
 * 
 *	gulp.src(pattern.htm)
 *	// 编译
 *	.pipe(compiler({
 *		// 编译目标目录
 *		target: output.codes,
 *		// 当前使用的模板文件
 *		template: appconfig.template[appconfig.env === 'dev' ? 'website' : 'app']
 *	}))
 *	.pipe(gulp.dest(output.codes+'/__html'))
 * 
 * @param {*} opt 
 */

module.exports = function ({template, target, compress}) {
	// 编译对象
	var compiler = new Compiler({template, target});
	// gulp调用入口
	return through.obj(function (file, enc, cb) {
		// 获取执行环境路径
		let cwd = file.cwd.replace(/\\/g, '/'),
		// 当前文件内容
		content = file._contents.toString(enc),
		// 当前文件相对路径
		url = file.history[0].replace(cwd + '/_src/', '').replace(/\\/g,'/')

		// 编译文件
		let res = compiler.compile({url, content, enc, cwd})

        // 压缩页面
		if(compress){
			res = minify(res, {
				html5:true,
				collapseBooleanAttributes:true,
				collapseWhitespace: true,
				removeComments: true,
				customAttrAssign: true,
				minifyJS: {
					compress: true,
					mangle: {
						toplevel: true
					}
				},
				minifyCSS: {
					level: 1
				}
			})
		}

		// 设置编译后内容到文件上
		file.contents = new Buffer(res, enc)

		// 返回文件
		return cb(null, file)
	});
};