/**
 * 用来一次性上传多组文件（每组可包含多个文件）和表单
 * @param  {[type]} win     [description]
 * @param  {[type]} builtIn [description]
 * @return {[type]}         [description]
 *
 * 注意：不能用label标签作为触发器，否则会弹出再次file框
 * 
 */
;(function(win, builtIn){
	function factory(base) {
		this.base = Object.assign({}, builtIn.__base, base);
		this.create = function(newOption) {
			var obitem = ++builtIn.__global.item;
			builtIn.__global.option[obitem] = Object.assign({}, builtIn.__option, newOption);
			builtIn.__global.fileQueue[obitem] = new Array();
			var option = builtIn.__global.option[obitem],
				fileQueue = builtIn.__global.fileQueue[obitem];
			var regex = option.type && new RegExp(builtIn.__regexFileType(option.type));
			// 绑定弹出文件选择框事件
			var pickers = builtIn.__getElement(option.pick);
			if (!pickers) throw new Error('指定的文件选择器不存在');
			for(var i in pickers) {
				if (!isNaN(i)) {
					pickers[i].onclick = function() {
						option.click(this);
						if (option.maxNum > fileQueue.length) {
							if (!this.getElementsByTagName('input').length) {
								fileBox	= document.createElement('input');
								fileBox.type = 'file';
								fileBox.accept = option.type;
								fileBox.multiple = option.multiple ? 'multiple' : '';
								fileBox.style.display = 'none';
								this.appendChild(fileBox);
							}
							fileBox.onclick = function(event) {
								event.stopPropagation(); 
							}// 阻止事件冒泡
							fileBox.click(); // 程序触发click事件
							fileBox.onchange = function() {
								var files = this.files;
								for (var item in files) {
									if (!isNaN(item)) {
										if (builtIn.__issetFile(fileQueue, files[item].name)) {
											option.errorInfo('已经存在相同文件'+files[item].name);
											continue;
										} // 存在相同文件，不加入队列
										if (option.maxSize && files[item].size > option.maxSize) {
											option.errorInfo('文件'+files[item].name+'尺寸过大');
											continue;
										} // 文件尺寸不符合，不加入队列
										if (regex && !regex.test(files[item].type)) {
											option.errorInfo('文件'+files[item].name+'类型不符');
											continue; 
										} // 文件类型不符合，不加入队列
										if (fileQueue.length >= option.maxNum ) {
											option.errorInfo('选择的文件已经达到'+option.maxNum+'个，不再继续添加');
											break; 
										} // 超出设置长度，退出循环，此判断用于用户多选时超出范畴
										files[item].id = builtIn.__createFileId(); // 给文件信息添加id
										fileQueue.push(files[item]); // 添加文件进入文件队列中
										option.queue(files[item]); // 触发队列事件	
									}
								}
							}	
						}else {
							option.errorInfo('已经选择了'+option.maxNum+'个文件，不能再上传了');
						}
					}
				}
			}
		}
		this.removeFile = function(id) {
			var files = builtIn.__global.fileQueue;
			outer:
			for (var i in files) {
				for (var j in files[i]) {
					if (id == files[i][j].id) {
						files[i].splice(j, 1);
						break outer; // break 跳出多重循环
					}
				}
			}
		}
		this.getDataUrl = function(file, backcall) {
			var fr = new FileReader();
			fr.readAsDataURL(file);
		    fr.onload = function() {
	        	backcall(this.result); // this.result为base64编码
	        };
	        fr.onerror = function() {
	        	backcall(false);
	        };
	        fr.onloadend = function() {
	        	delete fr;
	        }
		}
		this.addFormData = function(data) { // 动态添加表单数据
			Object.assign(this.base.formData, data);
		}
		this.uploade = function() {
			var base = this.base;
			if (base.server) {
				var formData = new FormData(),
					files = builtIn.__global.fileQueue,
					options = builtIn.__global.option;
				for (var i in base.formData) // 表单数据
					formData.append(i, base.formData[i]);
				for (var i in files)
					for (var j in files[i]) 
						formData.append(options[i].name+i+j, files[i][j]);
				base.beforeSend();
				var request = new XMLHttpRequest();
				request.onreadystatechange = function() {
					if(request.readyState === 4) {
						if (request.status == 200) {
							base.success(request.responseText);
						}else{
							base.fail(request.status);
						}
						base.always();
					}
				}
				request.upload.addEventListener('progress',function(e) {
					// e.loaded 已经上传大小情况
					// e.total  附件总大小
	 	            if (e.lengthComputable) {
	 		            var percent = Math.floor(e.loaded/e.total*100);
	 		            if(percent <= 100) base.process(percent);
	 	            }
		        }, false);
				request.open(base.method, base.server, true);
				request.send(formData);
			}else {
				throw new Error('没有设置服务器地址');
			}
		}
	}
	// 若不支持FileReader和FormData API 则不创建插件
	typeof FileReader !== 'undefined' && typeof FormData !== 'undefined' && 
	(win[builtIn.__info.plug] = factory);
})(window, {
	__info: {
		version: '2.0.2',
		plug: 'muldimUploader',
		author: 'Robert Du'
	},
	__global: {
		item: -1,
		option: {}, // 插件参数
		fileQueue: new Array(), // 文件队列
	},
	__base: {
		server: '',
		method: 'POST',
		formData: {}, // 附带传输的表单数据
		process: function(n) {},
		beforeSend: function() {},
		success: function(d) {},
		fail: function(xhr) {},
		always: function() {}
	},
	__option: {
		pick: '',
		multiple: false,
		type: '',
		maxNum: 3,
		maxSize: '',
		name: 'file',
		click: function(el) {},
		queue: function(f) {},
		errorInfo: function(i) {}
	},
	__getElement: function(name) {
		var firstStr = name.substr(0,1),
			needStr = name.substr(1);
		if (firstStr === '#')
			return [document.getElementById(needStr)];
		else if(firstStr === '.')
			return document.getElementsByClassName(needStr);
		else
			throw new Error('没有选择id或类名');
	},
	__createFileId: function() { 
		var id = Math.floor(Math.random()*1000000),
			files = this.__global.fileQueue;
		for (var i in files) 
			for (var j in files[i])
				if (id == files[i][j].id) this.__createFileId();
		return id;
	}, // 创建文件id
	__issetFile: function(files, name) { 
		for (var item in files) {
			if (name == files[item].name) return true;
		}
		return false;
	}, // 判断是否有相同的文件
	__regexFileType: function(type) { 
		var typeArr = type.split(',');
		if (typeArr.length == 1)
			return type;
		else if(typeArr.length > 1) 
			return typeArr.join('|');
	} // 当文件类型为"image/jpeg,image/png"，需转化分割符，以便正则识别
});