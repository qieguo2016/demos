// fill with cubes

define(function() {
	var module = {};
	var tileSize;
	var tiles = [];
	var canvas;
	var ctx;
	var cycler = 0;
	var gr = 0.618; // golden ratio
	var cnt = null;

	function Cube(sides, x, y, freq, tileSize, ctx) {
		this.sides = sides;
		this.tileSize = tileSize;
		this.ctx = ctx;
		this.x = x;
		this.y = y;
		this.freq = freq;
		// calculate the vertices of the polygon
		this.vertices = [];
		for (var i = 1; i <= this.sides; i += 1) {
			x = this.x + this.tileSize * Math.cos(i * 2 * Math.PI / this.sides + Math.PI / 6);
			y = this.y + this.tileSize * Math.sin(i * 2 * Math.PI / this.sides + Math.PI / 6);
			this.vertices.push([x, y]);
		}
	}

	Cube.prototype.drawPolygon = function() {
		this.ctx.beginPath();
		this.ctx.moveTo(this.x + this.tileSize * Math.cos(0 + Math.PI / 6), this.y + this.tileSize * Math.sin(0 + Math.PI / 6));

		// draw the polygon
		for (var i = 0; i <= this.sides - 1; i += 1) {
			this.ctx.lineTo(this.vertices[i][0], this.vertices[i][1]);
		}
		this.ctx.closePath();
		var freq = this.freq;
		var r = Math.round(Math.sin(cycler * freq * gr + 1) * 127) + 128;
		var g = Math.round(Math.sin(cycler * freq * gr + 2) * 127) + 128;
		var b = Math.round(Math.sin(cycler * freq * gr + 4) * 127) + 128;

		this.ctx.fillStyle = "rgb(" + r + ", " + g + ", " + b + ")";
		this.ctx.strokeStyle = "black";
		this.ctx.lineWidth = 1;
		this.ctx.stroke();
		this.ctx.fill();

		// draw a face of the cube
		this.ctx.beginPath();
		this.ctx.moveTo(this.x, this.y);
		this.ctx.lineTo(this.vertices[0][0], this.vertices[0][1]);
		this.ctx.lineTo(this.vertices[1][0], this.vertices[1][1]);
		this.ctx.lineTo(this.vertices[2][0], this.vertices[2][1]);
		this.ctx.closePath();
		this.ctx.fillStyle = "rgba(0,0,0,0.1)";
		this.ctx.fill();

		// draw another face of the cube
		this.ctx.beginPath();
		this.ctx.moveTo(this.x, this.y);
		this.ctx.lineTo(this.vertices[4][0], this.vertices[4][1]);
		this.ctx.lineTo(this.vertices[5][0], this.vertices[5][1]);
		this.ctx.lineTo(this.vertices[0][0], this.vertices[0][1]);
		this.ctx.closePath();
		this.ctx.fillStyle = "rgba(0,0,0,0.35)";
		this.ctx.fill();
	};

	module.makePolygonArray = function() {
		tiles = [];
		var canvasWidth = canvas.width;
		var canvasHeight = canvas.height;
		var xStep = Math.round(Math.cos(Math.PI / 6) * tileSize * 2);
		var yStep = Math.round(Math.cos(Math.PI / 3) * tileSize + tileSize);
		var xCoord = -xStep;
		var yCoord = 0;
		while (yCoord < canvasHeight + yStep) {
			if (xCoord > canvasWidth) {
				xCoord = (xCoord % xStep === 0) ? xStep / 2 : 0;
				yCoord += yStep;
			} else {
				xCoord += xStep;
			}
			var freq = Math.random();
			tiles.push(new Cube(6, xCoord, yCoord, freq, tileSize, ctx));
		}
	};

	module.resize = function() {
		canvas.width = cnt.clientWidth;
		canvas.height = cnt.clientHeight;;

		module.makePolygonArray();
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
		
		module.makePolygonArray();
		module.draw();
	};

	module.draw = function() {
		tiles.forEach(function(tile) {
			tile.drawPolygon();
		});
		cycler += 0.05;
		requestAnimationFrame(module.draw);
	};

	return module;
	
});
