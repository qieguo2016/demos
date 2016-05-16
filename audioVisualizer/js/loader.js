var lightLoader = function(c, cw, ch){

	var that = this;
	this.c = c;
	this.ctx = c.getContext('2d');
	this.cw = cw;
	this.ch = ch;			
	this.raf = null;
	
	this.loaded = 0;
	this.loaderSpeed = .6;
	this.loaderWidth = cw * 0.8;
	this.loaderHeight = 20;
	this.loader = {
		x: (this.cw/2) - (this.loaderWidth/2),
		y: (this.ch/2) - (this.loaderHeight/2)
	};
	this.particles = [];
	this.particleLift = 220;
	this.hueStart = 0
	this.hueEnd = 120;
	this.hue = 0;
	this.gravity = .15;
	this.particleRate = 4;	
					
	/*========================================================*/	
	/* Initialize
	/*========================================================*/
	this.init = function(){
		this.loaded = 0;
		this.particles = [];
		this.loop();
	};
	
	/*========================================================*/	
	/* Utility Functions
	/*========================================================*/				
	this.rand = function(rMi, rMa){return ~~((Math.random()*(rMa-rMi+1))+rMi);};
	this.hitTest = function(x1, y1, w1, h1, x2, y2, w2, h2){return !(x1 + w1 < x2 || x2 + w2 < x1 || y1 + h1 < y2 || y2 + h2 < y1);};
	
	/*========================================================*/	
	/* Update Loader
	/*========================================================*/
	this.updateLoader = function(){
		if(this.loaded < 100){
			this.loaded += this.loaderSpeed;
		} else {
			this.loaded = 0;
		}
	};
	
	/*========================================================*/	
	/* Render Loader
	/*========================================================*/
	this.renderLoader = function(){
		this.ctx.fillStyle = '#000';
		this.ctx.fillRect(this.loader.x, this.loader.y, this.loaderWidth, this.loaderHeight);
		
		this.hue = this.hueStart + (this.loaded/100)*(this.hueEnd - this.hueStart);
		
		var newWidth = (this.loaded/100)*this.loaderWidth;
		this.ctx.fillStyle = 'hsla('+this.hue+', 100%, 40%, 1)';
		this.ctx.fillRect(this.loader.x, this.loader.y, newWidth, this.loaderHeight);
		
		this.ctx.fillStyle = '#222';
		this.ctx.fillRect(this.loader.x, this.loader.y, newWidth, this.loaderHeight/2);
	};	
	
	/*========================================================*/	
	/* Particles
	/*========================================================*/
	this.Particle = function(){					
		this.x = that.loader.x + ((that.loaded/100)*that.loaderWidth) - that.rand(0, 1);
		this.y = that.ch/2 + that.rand(0,that.loaderHeight)-that.loaderHeight/2;
		this.vx = (that.rand(0,4)-2)/100;
		this.vy = (that.rand(0,that.particleLift)-that.particleLift*2)/100;
		this.width = that.rand(2,6)/2;
		this.height = that.rand(2,6)/2;
		this.hue = that.hue;
	};
	
	this.Particle.prototype.update = function(i){
		this.vx += (that.rand(0,6)-3)/100; 
		this.vy += that.gravity;
		this.x += this.vx;
		this.y += this.vy;
		
		if(this.y > that.ch){
			that.particles.splice(i, 1);
		}					
	};
	
	this.Particle.prototype.render = function(){
		that.ctx.fillStyle = 'hsla('+this.hue+', 100%, '+that.rand(50,70)+'%, '+that.rand(20,100)/100+')';
		that.ctx.fillRect(this.x, this.y, this.width, this.height);
	};
	
	this.createParticles = function(){
		var i = this.particleRate;
		while(i--){
			this.particles.push(new this.Particle());
		};
	};
					
	this.updateParticles = function(){					
		var i = this.particles.length;						
		while(i--){
			var p = this.particles[i];
			p.update(i);											
		};						
	};
	
	this.renderParticles = function(){
		var i = this.particles.length;						
		while(i--){
			var p = this.particles[i];
			p.render();											
		};					
	};
	

	/*========================================================*/	
	/* Clear Canvas
	/*========================================================*/
	this.clearCanvas = function(){
		this.ctx.globalCompositeOperation = 'source-over';
		this.ctx.clearRect(0,0,this.cw,this.ch);					
		this.ctx.globalCompositeOperation = 'lighter';
	};
	
	/*========================================================*/	
	/* Animation Loop
	/*========================================================*/
	this.loop = function(){
		var loopIt = function(){
			that.raf =  requestAnimationFrame(loopIt);
			that.clearCanvas();
			
			that.createParticles();
			
			that.updateLoader();
			that.updateParticles();
			
			that.renderLoader();
			that.renderParticles();
			
		};
		loopIt();					
	};
	
	
	this.stop = function(){
		window.cancelAnimationFrame(this.raf);
		this.clearCanvas();
	}

};


/*========================================================*/	
/* Setup requestAnimationFrame when it is unavailable.
/*========================================================*/
var setupRAF = function(){
	var lastTime = 0;
	var vendors = ['ms', 'moz', 'webkit', 'o'];
	for(var x = 0; x < vendors.length && !window.requestAnimationFrame; ++x){
		window.requestAnimationFrame = window[vendors[x]+'RequestAnimationFrame'];
		window.cancelAnimationFrame = window[vendors[x]+'CancelAnimationFrame'] || window[vendors[x]+'CancelRequestAnimationFrame'];
	};
	
	if(!window.requestAnimationFrame){
		window.requestAnimationFrame = function(callback, element){
			var currTime = new Date().getTime();
			var timeToCall = Math.max(0, 16 - (currTime - lastTime));
			var id = window.setTimeout(function() { callback(currTime + timeToCall); }, timeToCall);
			lastTime = currTime + timeToCall;
			return id;
		};
	};
	
	if (!window.cancelAnimationFrame){
		window.cancelAnimationFrame = function(id){
			clearTimeout(id);
		};
	};
};