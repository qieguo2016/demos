/*-----------------------------【程序说明】-----------------------------
 *	程序说明：	使用HTML5 Web Audio API实现音乐可视化效果
 *	程序描述：	有常规频谱和能量球两种方式，能量球方式还提供了捕捉能量球的交互效果，
 *			并支持PC端的鼠标捕捉和移动端的触屏捕捉。
 *	浏览器支持：Chrome、Firefox、Safari（若有问题，请更新浏览器到最新版）
 *	2016年04月 Created by @Qieguo
 *	更多信息请关注我的博客：http://www.cnblogs.com/qieguo/p/5405303.html
 *
 *	Reference: 1)参考了刘哇勇的文章并使用了一部分代码。http://www.cnblogs.com/Wayou/p/html5_audio_api_visualizer.html
 * 			   2)Visualizations with Web Audio API(官方原版，强力推荐)
 * 			     https://developer.mozilla.org/en-US/docs/Web/API/Web_Audio_API/Visualizations_with_Web_Audio_API
 *  Licensed under the MIT，转载使用请注明出处！http://www.cnblogs.com/qieguo/p/5405303.html
 *--------------------------------------------------------------------
 */


"use strict"
var mymv;
function resizeCanvas () {
	var canvas = document.getElementById('drawCanvas');
	canvas.width = window.clientWidth
				   || document.documentElement.clientWidth
				   || document.body.clientWidth;
	canvas.height = window.clientHeight
					|| document.documentElement.clientHeight
					|| document.body.clientHeight;			
}

window.onload = function() {
	//根据浏览器尺寸设置画布的尺寸
	resizeCanvas();
					
	//浏览器加载时初始化MV对象
	mymv = new MV();
	mymv.init();
	
	var canvas = document.getElementById('drawCanvas');
	//鼠标捕捉能量球
	canvas.onmousemove = function (e) {
		if (mymv.status != 0) {
			for (var n = 0; n < mymv.visualizer.length; n++) {
				var s = mymv.visualizer[n];
				if (Math.sqrt(Math.pow(s.x-e.pageX,2) + Math.pow(s.y-e.pageY,2)) < s.radius) {
					s.x = e.pageX;
					s.y = e.pageY;
				}
			}
		}
	};
	
	/*触屏设备单指拖动能量球*/
	canvas.addEventListener('touchmove', function(event) {
		//判断是否播放状态
		if (mymv.status != 0) {
		    // 如果画布内只有一个手指的话
		    if (event.targetTouches.length == 1) {
		　　　	event.preventDefault();// 阻止浏览器默认事件，重要 
		        var touch = event.targetTouches[0];
		        // 把能量球放在手指所在的位置()
		        for (var n = 0; n < mymv.visualizer.length; n++) {
					var s = mymv.visualizer[n];
					if (Math.sqrt(Math.pow(s.x-touch.pageX,2) + Math.pow(s.y-touch.pageY,2)) < 30) {
						s.x = touch.pageX;
						s.y = touch.pageY;  
					}
				}
		    }
	   	}
	}, false);
	
	//测试绘图样式
	canvas.onclick = function (e) {
		//判断播放状态，不播放的时候才触发
		if (mymv.status === 0) {
			var ctx = canvas.getContext('2d');
			var gradient = ctx.createRadialGradient(e.pageX, e.pageY, 0, e.pageX, e.pageY, 30);
			var random = function (m, n) { return Math.round(Math.random()*(n - m) + m); };
			//内发光，圆内变色
			var color = 'hsla(' + random(0, 360) + ',' + '100%,' + random(50, 60) + '%,1)';
			gradient.addColorStop(0, 'hsla(0,0%,100%,0.8)');
			gradient.addColorStop(0.6, color);
	    		gradient.addColorStop(1, 'hsla(0,0%,100%,0)');
	    		//内发光，圆外变色
//	    		var color = 'hsla(' + random(0, 360) + ',' + '100%,' + random(50, 60) + '%,0)';
//	    		gradient.addColorStop(0, 'hsla(0,0%,100%,1)');
//			gradient.addColorStop(0.6, 'hsla(0,5%,98%,0.8)');
//			gradient.addColorStop(1, color);
    		ctx.fillStyle = gradient;
    		ctx.beginPath();
    		ctx.arc(e.pageX, e.pageY, 30, 0, Math.PI*2, true);
			ctx.fill();
		}
	};
	
};

//根据浏览器尺寸设置画布的尺寸
window.onresize = function () { resizeCanvas(); };

//定义MV对象的属性
var MV = function() {
	this.files = null;		//Music Visualize对象的文件
	this.fileName = null;	//Music Visualize对象的文件名
	this.ac = null;   		//Music Visualize对象的AudioContext
	this.status = 0;		//Music Visualize对象的状态（播放/停止状态）
	this.forceStop = false; 	//强制终止播放状态
	this.animationId = null;	//动画ID
	this.source = null;			//流媒体的源
	this.visualizer = [];		//频谱表现形式，包含x,y,dy,color,radius
	this.canvas = null;		//画布
	this.loader = null;		//进度条
};

//定义MV对象方法，原型方式
MV.prototype = {
	init: function() {
		//浏览器兼容设置
		window.AudioContext = window.AudioContext || window.webkitAudioContext || window.mozAudioContext || window.msAudioContext;
		window.requestAnimationFrame = window.requestAnimationFrame || window.webkitRequestAnimationFrame || window.mozRequestAnimationFrame || window.msRequestAnimationFrame;
		window.cancelAnimationFrame = window.cancelAnimationFrame || window.webkitCancelAnimationFrame || window.mozCancelAnimationFrame || window.msCancelAnimationFrame;
		try {
			this.ac = new AudioContext();
		} catch (err) {
			alert('!Your browser does not support AudioContext, Please change to Chrome or Firefox!');
			console.log(err);
		};
		
		//隐藏文件输入控件，通过fileIn文本的click事件调用文件输入控件
		var that = this,
			btn = document.getElementById('fileIn'),
			audioInput = document.getElementById('uploader');
			
		this.canvas = document.getElementById('drawCanvas');
		this.loader = new lightLoader(this.canvas, this.canvas.width, this.canvas.height - 1);
		setupRAF();  //当浏览器不支持requestAnimationFrame的时候设置个备胎
		
		btn.onclick = function () { 
			
//			var request = new XMLHttpRequest();　　//开一个请求
//			var url = "http://passionate.herokuapp.com/media/徐良-坏女孩.mp3";
//		    request.open('GET', url);　　　　//往url请求数据
//		    request.responseType = 'arraybuffer';  //设置返回数据类型
//		    request.onload = function() {
//		        var audioData = request.response;
//		        console.log(audioData);
//		        //数据缓冲完成之后，进行解码
//		        that.ac.decodeAudioData(audioData, function(buffer) {
//		        	that._control(that.ac, buffer);	
//		            //source.buffer = buffer;  //将解码出来的数据放入source中
//		            //进行数据处理
//		        }, function(err) {
//		　　　　　　　alert('!Fail to decode the file!');   //解码出错处理
//		　　　　  });
//		    };
//		    request.send();


			audioInput.click();
		};
		//监控文本输入控件的改变，判断是否读入文件或者切换文件
		audioInput.onchange = function() {
			if (that.ac === null) {return;};	//new AudioContext失败，则退出函数
			//判断是否真正选中文件，因为取消也可以触发onchange事件
			if (audioInput.files.length !== 0) {
				//仅获取文件列中的第一个文件
				that.files = audioInput.files[0];
				that.fileName = audioInput.files[0].name;
				if (that.status === 1) {
					//正在播放的时候切换文件，需要强制停止，将forceStop置为true
					that.forceStop = true;
					//停止前一首歌曲
			        if (that.animationId !== null) {
			            cancelAnimationFrame(that.animationId);
			        }
					if (that.source !== null) {
            			that.source.stop(0);
        			}
				};
				//当文件准备好的时候，开始读入
				that._read();
				that.loader.init();
			};
		};
	},
	
	_read: function() {
		//读取文件，并进行解码
		var that = this,
			rfile = that.files,
			fr = new FileReader();
		fr.onload = function(e) {
			if (that.ac === null) {
        		return;
    		};
			that._updateInfo('Decoding the audio', true);
			//AudioContext.decodeAudioData解码Audio文件，第一个参数为缓冲数列
			var fileResult = e.target.result;
			that.ac.decodeAudioData(fileResult, function(buffer) {
				that._updateInfo('Decode succussfully,start the visualizer', true);
				//转到播放和分析环节
				that.loader.stop();
				that._control(that.ac, buffer);	
			}, function(err) {
				alert('!Fail to decode the file');
				console.log(err);
			});
		};
		fr.onerror = function(err) {
        	alert('!Fail to read the file');
        	console.log(err);
        };
		that._updateInfo('Starting read the file', true);
		//ArrayBuffer方式读取
		fr.readAsArrayBuffer(rfile);		
	},
	
	_control: function(audioContext, buffer) {
		//创建BufferSource来保存解码出来的数据流
		var bufferSouceNode = audioContext.createBufferSource(),
			analyser = audioContext.createAnalyser(),
			that = this;
		//将音源连接起来，音源>分析器>输出
		bufferSouceNode.connect(analyser);
        analyser.connect(audioContext.destination);
        bufferSouceNode.buffer = buffer;
        bufferSouceNode.loop = true;
        //启动，也就是启动音频读入>分析>输出这个流程
        if (!bufferSouceNode.start) {
            bufferSouceNode.start = bufferSouceNode.noteOn //旧版本语法：noteOn
            bufferSouceNode.stop = bufferSouceNode.noteOff //旧版本语法：noteOn
		};
        //停止前一首歌曲
        if (this.animationId !== null) {
            cancelAnimationFrame(this.animationId);
        }
        if (this.source !== null) {
            this.source.stop(0);
        }
        //启动的新版本语法
        bufferSouceNode.start(0);		
        this.status = 1;
        this.source = bufferSouceNode;
        //音频结束事件，绑定_audioEnd函数
		bufferSouceNode.onended = function() {
    		that._audioEnd(that);
		};
		this._updateInfo('Playing ' + this.fileName, false);
        this._visualize_flow(analyser);		//能量球样式的可视化效果
        //this._visualize(analyser);		//柱状图样式的可视化效果
	},
	
	_visualize: function(analyser) {
		var that = this,
	    	cwidth = this.canvas.width,
	    	cheight = this.canvas.height - 2,    //底部留一点余白
	    meterWidth = 10, //能量条的宽度
	    gap = 2, //能量条间的间距
	    capHeight = 2,
    	capStyle = '#fff',
	    meterNum = Math.round(cwidth / (meterWidth + gap)),	
	    capYPositionArray = [],		//保存能力柱帽子的先前位置
	    ctx = this.canvas.getContext('2d');
	    
		//定义一个渐变样式用于画图
		var gradient = ctx.createLinearGradient(0, 0, 0, cheight);
		gradient.addColorStop(1, '#0f0');
		gradient.addColorStop(0.5, '#ff0');
		gradient.addColorStop(0, '#f00');
		ctx.fillStyle = gradient;
		
		var drawMeter = function() {
	    	var array = new Uint8Array(analyser.frequencyBinCount);
	    	analyser.getByteFrequencyData(array);
	    	if (that.status === 0) {
                //曲终时能量帽的归零
                for (var i = array.length - 1; i >= 0; i--) {
                    array[i] = 0;
                };
                allCapsReachBottom = true;
                for (var i = capYPositionArray.length - 1; i >= 0; i--) {
                    allCapsReachBottom = allCapsReachBottom && (capYPositionArray[i] === 0);
                };
                if (allCapsReachBottom) {
                	//！！！音频播完动画结束了！必须手动停止动画以防内存泄露!非常重要！！！
                    cancelAnimationFrame(that.animationId); 
                    return;
                };
        	};
        	//计算步长
        	var step = Math.round(array.length / meterNum); 
    		ctx.clearRect(0, 0, cwidth, cheight);
	    	for (var i = 0; i < meterNum; i++) {
                var value = array[i * step] * cheight / 256;
                if (capYPositionArray.length < Math.round(meterNum)) {
                    capYPositionArray.push(value);
                };
                ctx.fillStyle = capStyle;
                //绘制能量帽
                if (value < capYPositionArray[i]) {
                    ctx.fillRect(i * (meterWidth + gap), cheight - (--capYPositionArray[i]), meterWidth, capHeight);
                } else {
                    ctx.fillRect(i * (meterWidth + gap), cheight - value, meterWidth, capHeight);
                    capYPositionArray[i] = value;
                };
                //使用渐变填充得到更好的效果
                ctx.fillStyle = gradient; 
                ctx.fillRect(i * (meterWidth + gap), cheight - value + capHeight, meterWidth, cheight); //the meter
            }
	    	//这个与后面一句区别在this和that。严格模式下播放时this为undefined，一般模式下this指向window。
	    	//_visualize，_audioEnd这些为MV的方法，所以函数内部this指向MV，但其内部嵌套的函数并非MV的函数，其原型为window！
	    	//所以在进入嵌套函数内部时，this已经被改变了，需要用一个that来保存this的指向对象MV
            that.animationId = requestAnimationFrame(drawMeter); 
        };
        this.animationId = requestAnimationFrame(drawMeter);
	},
	
	_visualize_flow: function(analyser) {
		var that = this,
	    cwidth = this.canvas.width,
	    cheight = this.canvas.height,
	    num = cwidth > 500 ? 30 : 50,		//能量球的数量
	    ctx = this.canvas.getContext('2d');
	    		    
		var random = function (m, n) {
			return Math.round(Math.random()*(n - m) + m);
		};
		for (var i = 0; i < num; i++) {
			var x = random(0, cwidth),
				y = random(0, cheight),
				color= 'hsla(' + random(0, 360) + ',' + '100%,' + random(50, 60) + '%,1)';
			that.visualizer.push({
				x: x,
				y: y,
				dy: Math.random() + 0.1,	//返回大于0.1的数据，防止静止
				color: color,
				radius: 30
			});
		}
		
		var drawMeter = function() {
			//创建8位整数数组保存频谱数据
	    	var array = new Uint8Array(analyser.frequencyBinCount);
	    	analyser.getByteFrequencyData(array);
	    	if (that.status === 0) {
                //能量球归零
                for (var i = array.length - 1; i >= 0; i--) {
                    array[i] = 0;
                };
                var allBallstoZero = true;
                for (var i = that.visualizer.length - 1; i >= 0; i--) {
                    allBallstoZero = allBallstoZero && ( that.visualizer[i].radius < 1);
                };
                if (allBallstoZero) {
                	//！！！音频播完动画结束了！必须手动停止动画以防内存泄露!非常重要！！！
                    cancelAnimationFrame(that.animationId); 
                    return;
                };
        	};
        	cwidth = that.canvas.width;
	    	cheight = that.canvas.height;
	    	num = cwidth > 600 ? 30 : 50;		//能量球的数量
	    	var step = Math.round(array.length / (num + 10));  //计算步长
	    	ctx.clearRect(0, 0, cwidth, cheight);
	    	for (var n = 0; n < num; n++) {
	    		var s = that.visualizer[n];
	    		//能量球半径，与画布大小关联起来
	    		s.radius = Math.round(array[n * step] / 256 * cwidth / 10 );
	    		//加了一点模糊发光的效果
	    		var gradient = ctx.createRadialGradient(s.x, s.y, 0, s.x, s.y, s.radius);
	    		gradient.addColorStop(0, 'hsla(0,0%,100%,0.8)');
	    		gradient.addColorStop(0.6, s.color);
	    		gradient.addColorStop(1, 'hsla(0,0%,100%,0)');
//	    		gradient.addColorStop(0.6, 'hsla(0,0%,100%,1)');
//				gradient.addColorStop(1, s.color);
	    		ctx.fillStyle = gradient;
	    		ctx.beginPath();
	    		ctx.arc(s.x, s.y, s.radius, 0, Math.PI*2, true);
				ctx.fill();
	    		s.y = s.y - 2 * s.dy;	//上飘效果
	    		//到顶部后返回底部，随机化
	    		if ((s.y <= 0)&&(that.status != 0)) {
	    			s.y = cheight;
	    			s.x = random(0, cwidth);
	    			s.color = 'hsla(' + random(0, 360) + ',' + '100%,' + random(50, 60) + '%,1)';
	    		}
	    	}
	    	//严格模式下播放时this为undefined，一般模式下this指向window。
	    	//_visualize，_audioEnd这些为MV的方法，所以函数内部this指向MV，但其内部嵌套的函数并非MV的函数，其原型为window！
	    	//所以在进入嵌套函数内部时，this已经被改变了，需要用一个that来保存this的指向对象MV
		 	that.animationId = requestAnimationFrame(drawMeter); 
        };
        this.animationId = requestAnimationFrame(drawMeter); //启动动画
	},
	//音频播放结束，绑定了onended事件
	_audioEnd: function(instance) {
        if (this.forceStop) {
            this.forceStop = false;
            this.status = 1;
            return;
        };
        this.status = 0;
        var text = 'HTML5 Audio visualizer';
        document.getElementById('info').innerHTML = text;
        document.getElementById('uploader').value = '';
    },
    //信息输出
	_updateInfo: function(text, processing) {
        var infoBar = document.getElementById('info'),
            dots = '...',
            i = 0,
            that = this;
        infoBar.innerHTML = text + dots.substring(0, i++);
        if (this.infoUpdateId !== null) {
            clearTimeout(this.infoUpdateId);
        };
        if (processing) {
            //末尾3个点号的小动画
            var animateDot = function() {
                if (i > 3) {
                    i = 0
                };
                infoBar.innerHTML = text + dots.substring(0, i++);
                that.infoUpdateId = setTimeout(animateDot, 250);
            }
            this.infoUpdateId = setTimeout(animateDot, 250);
        };
	}
};
	
