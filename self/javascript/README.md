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

+ __配置说明__
	
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

> 可以有多个文件夹

+ __代码演示__

```
	pickFile.create({
		pick: "#picker1",
		multiple: true,
		maxNum: 2,
		name: 'img',
		type: 'image/jpeg',
		click: function(el) {
			console.log(el);
		},
		queue: function(file) {
			document.getElementById('del').onclick = function() {
				pickFile.removeFile(file.id);
			};
		},
		errorInfo: function(info) {
			console.log(info);
		}
	});

```

+ __配置说明__
	
	>	- pick： 文件夹选择器，把一个或多个HTML元素绑定到此文件夹中，凡是通过这些元素点击选择的文件都将遵守此文件夹的规则，#为id，.为class [String]

	>	- multiple： 是否允许多选文件 [Boolean]

	>	- maxNum： 限定文件选择数量 [Number]

	>	- maxSize： 限定每个文件的最大值，单位字节 [Number]

	>	- name： 文件夹的名字，默认为file，为了避免多个文件夹取相同名字会导致上传时文件会被覆盖，所以会根据顺序在其后加两个数字，如：php接收第二个文件夹的第三个文件时，应用FILES['file12']

	>	- click： 当文件夹选择器点击后，会触发此方法 [Function]  
			参数说明： 此文件选择器的HTML元素对象

	>	- queue： 每当有一个文件被添加进来后，会触发此方法 [Function]  
			参数说明： 文件对象，在原生的input[type="file"]的文件对象的基础上添加了文件id，每个文件夹里的文件都有一个唯一id，通过此id来进行文件删除等操作

	>	- errorInfo： 当不符合文件夹的配置规则时，会有一些内置的错误信息返回 [Function]   
			参数说明： 错误信息


+ __补充说明__

	1. 如果不清楚有哪些文件类型，访问这个[网站](https://www.iana.org/assignments/media-types/media-types.xhtml)


## 其他方法

+ __删除文件__

	` pickFile.removeFile(fileId); `
	
	> 通过文件id把此文件移出文件队列

+ __获取文件的base64__

```
	pickFile.getDataUrl(file, function(url) {
		document.getElementById('image').src = url;
	});

```

> 传入文件对象，当选择图片时，可以用来预览此图片

+ __addFormData__

	` pickFile.addFormData({}) `

	> 以键值对的形式，传入一些数据，作为表单数据，随文件一起发送

+ __uploade__

	` pickFile.uploade() `

	> 上传数据

