var express = require('express');
var router = express.Router();

// 添加文件上传插件 需要安装 multer 组件(dependencies中已经包含该组件 只需要npm install即可)
var path = require('path');
var multer  = require('multer');
var upload = multer({ dest: path.join(__dirname, '../public/upload/') });

// 解析Excel的组件xlsx, 需要安装 xlsx 组件
var XLSX = require('xlsx');

/* GET home page. */
router.get('/', function(req, res, next) {
  res.render('index', { title: 'Express' });
});

/**
 * 此处第二个参数为处理提交内容中的文件 (single表示单文件, 多文件用array)
 *    single中的参数为提交内容中的文件字段名docfile
 */
router.post('/fileupload', upload.single('docfile'), function(req, res, next) {
  // 通过req.file来获取提交中的文件对象即可用于解析处理
  // 如果是多文件则通过req.files[0]方式来获取想要的第几个
  const docfile = req.file;
  // 获取请求中的文本字段内容
  const remark = req.body.remark;

  console.log('uploadfile is:', docfile);
  console.log('remark is:', remark);

  // 加载Excel文件
  const workbook = XLSX.readFile(docfile.path);
  // 将Excel转成json对象(数据不大时可用此工具函数处理) (会以第一行为key来将之后的数据转成对象并放到数组中)
  // const uploadData = XLSX.utils.sheet_to_json(workbook.Sheets[workbook.SheetNames[0]]);

  const worksheet = workbook.Sheets[workbook.SheetNames[0]];

  const cell = worksheet['F3'];
  const dateValue = new Date(1900, 0, cell.v - 1);

  console.log(dateValue, cell.v, cell);

  // 循环添加到数据库中即可
  // console.log(uploadData);

  res.json({
    status: 200,
    message: '上传成功',
  });
});

/**
 * 加密
 */
router.post('/aes', function(req, res, next) {
  console.log(req.body);

  res.json({
    status: 200,
    message: '解密成功',
  });
});
module.exports = router;
