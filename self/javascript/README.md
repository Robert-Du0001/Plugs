# 说明文档
一个用来一次性上传多组文件夹（每组文件夹可包含多个文件）和表单的js简易上传插件。

仅适用于支持FileReader、FormData的浏览器。


## 构造一个上传器

> 这个上传器包含了二维文件 ---- 多组文件夹，每个文件夹又包含多个文件，并附带表单。

> 一个页面可以有多个上传器，但每个上传器互相独立，对应一个服务地址，及相应的响应函数

* __代码演示__
```
	var pickFile = new muldimUploader({
		server: '.server.php',
		formData: {
			fname: 'xxxx',
			lname: 'xxxx'
		},
		beforeSend: function() {
			console.log('before');
		},
		process: function(p) {
			console.log(p);
		},
		success: function(data) {
			console.log(data);
		},
		fail: function(code) {
			console.log('fail: '+code);
		},
		always: function() {
			console.log('always');
		}
	});
```

+ __参数说明__
	
	>	- server： 服务器接收数据的页面地址 [String]

	>	- method： 传输方式，默认为POST [String]

	>	- formData： 附带的表单数据 [Json]	

	>	- beforeSend： 发送数据前执行的函数 [Function]

	>	- process： 上传中执行的函数 [Function]  
			参数说明： 上传进度的百分比（未带百分号）

	>	- success： 上传成功后执行的函数 [Function]  
			参数说明： 服务器返回的响应数据

	>	- fail： 上传失败后执行的函数 [Function]  
			参数说明： 服务器返回的响应状态码

	>	- always： 上传后，不论是否成功都要执行的函数 [Function]  


## 创建一个文件夹

> 一个文件夹里可以包含多个相同类型的文件，比如评论时上传的多个图片则可以归属于这个文件夹

+ __代码演示__

```
	pickFile.create({
		pick: "picker1",
		multiple: true,
		maxNum: 2,
		name: 'img',
		type: 'image/jpeg',
		queue: function(file) {
			document.getElementById('del').onclick = function() {
				pickFile.removeFile(file.id);
			};
		}
	});

```

+ __补充说明__

	1. 如果不清楚有哪些文件类型，访问这个[网站](https://www.iana.org/assignments/media-types/media-types.xhtml)