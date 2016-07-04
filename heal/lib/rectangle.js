// fill with rectangles
　　
define(function() {　　　　

	var module = {};
	var tileSize;
	var numBlocks;
	var tiles = [];
	var canvas;
	var ctx;
	var cycler = 0;
	var gr = 0.618; // golden ratio
	var cnt = null;

	function Tile(x, y, freq, tileSize, ctx) {
		this.tileSize = tileSize;
		this.ctx = ctx;
		this.x = x;
		this.y = y;
		this.freq = freq;
	}
	Tile.prototype.drawTile = function() {
		var freq = this.freq;
		var r = Math.round(Math.sin(cycler * freq * gr) * 127) + 128;
		var g = Math.round(Math.sin(cycler * freq * gr + 2) * 127) + 128;
		var b = Math.round(Math.sin(cycler * freq * gr + 4) * 127) + 128;
		this.ctx.fillStyle = "rgb(" + r + ", " + g + ", " + b + ")";

		// var h = Math.round(cycler * freq * gr * 127),
		//     s = '100%',
		//     l = '50%';
		//this.ctx.fillStyle = "hsla(" + h + ", " + s + ", " + l + ", 1)";

		this.ctx.fillRect(this.x, this.y, this.tileSize, this.tileSize);
	};

	module.init = function(option) {

		var num = option.num || 10,
			height, width;

		cnt = option.cnt;
		height = cnt.clientHeight;
		width = cnt.clientWidth;

		canvas = document.createElement('canvas');
		canvas.width = width;
		canvas.height = height;
		cnt.appendChild(canvas);
		ctx = canvas.getContext("2d");

		tileSize = width / num;

		numBlocks = (width * height) / (tileSize * tileSize);
		for (var x = 0; x < numBlocks; x += 1) {
			var xCoord = (x * tileSize) % width;
			var yCoord = Math.floor(x / (width / tileSize)) * tileSize;
			var freq = Math.random();
			tiles.push(new Tile(xCoord, yCoord, freq, tileSize, ctx));
		}
	};

	module.draw = function() {
		tiles.forEach(function(tile) {
			tile.drawTile();
		});
		cycler += 0.05;
		requestAnimationFrame(module.draw);
	};

	return module;

});