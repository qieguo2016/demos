/*-----------------------------【程序说明】-----------------------------
 *	程序说明：	HTML5实现“摇一摇”功能
 *	程序描述：	1）移动端音频需要用户指定播放或者加载，否则不能播放。
 * 			2）微信和QQ浏览器对flex弹性布局的支持还局限在旧版本。
 *	浏览器支持：主流浏览器，IE除外（若有问题，请更新浏览器到最新版）
 *	2016年04月 Created by @Qieguo
 *	更多信息请关注我的博客：http://www.cnblogs.com/qieguo/
 *
 *	Reference: 1) https://developer.mozilla.org/en-US/docs/Web/API/Detecting_device_orientation
 * 			   2) https://developer.mozilla.org/en-US/docs/Web/API/Vibration_API
 *  Licensed under the MIT，转载使用请注明出处！ http://www.cnblogs.com/qieguo/
 *--------------------------------------------------------------------
 */


var Shake = function (threshold) {
	var that = this;
	this.SHAKE_THRESHOLD = threshold ? threshold : 2000; //定义阈值            
	this.last_update = 0;
	this.x = this.y = this.z = this.last_x = this.last_y = this.last_z = 0; 
	
	this.shakeAudio = new Audio();		//摇一摇声音
	this.shakeAudio.src = 'source/shake_sound.mp3';
	this.audioLoaded = false;	//音频加载标志
	
	this.shakeEffect = document.getElementsByClassName('shake-box')[0];  //摇一摇图片分裂效果
	this.img = document.getElementById('id-shake-image');	//摇一摇后显示图片
	var images = ['source/000.jpg', 'source/001.jpg', 'source/002.jpg'],
		imgSource = new Image();
	for (var _index = 0; _index < images.length; _index++) {
		imgSource.src = images[_index];
	}
	
	
	this.init = function() {                
		if (window.DeviceMotionEvent) {
			window.addEventListener('devicemotion', this.deviceMotionHandler, false); 
		} else {                  
			alert('您的浏览器不支持重力传感器');    
		}           
	};
	
	this.deviceMotionHandler = function(eventData) {        
		var acceleration = eventData.acceleration;   
		var curTime = new Date().getTime();         
		
		//检测频率：每100ms一次
		if ((curTime - that.last_update) > 100) {     
			var diffTime = curTime - that.last_update;      
			that.last_update = curTime;     
			
			that.x = acceleration.x;            
			that.y = acceleration.y;         
			that.z = acceleration.z;      
			var speed = Math.abs(that.x + that.y + that.z - that.last_x - that.last_y - that.last_z) / diffTime * 10000;            
			if (speed > that.SHAKE_THRESHOLD) {  
				
				//do something
				that.shakeAudio.play();		//摇一摇音效
				window.navigator.vibrate(200);	//振动效果
				that.shakeEffect.className = 'shake-box shaking';	//摇一摇图片动态
				clearTimeout(shakeTimeout);
				clearTimeout(changeImage);
				
				var shakeTimeout = setTimeout(function() {
					that.shakeEffect.className = 'shake-box';
				},4000);
				
				//更改显示的图片
				var changeImage = setTimeout(function () {
					that.img.src = images[ Math.floor( Math.random() * 3)];
				},4200);				
			}    
			
			that.last_x = that.x;      
			that.last_y = that.y;               
			that.last_z = that.z;         
		}        
	};
};

window.onload = function(){   
	var shake1 = new Shake(2000);	//创建shake对象
	shake1.init();   	//初始化，绑定devicemotion事件
	
	window.addEventListener('touchstart',function () {
		if ( !shake1.audioLoaded ) {
			shake1.shakeAudio.load();  //load事件必须由用户触发
			shake1.audioLoaded = true;
			document.getElementsByClassName('bodymask')[0].style.display = 'none';
		}
	}, false);
};