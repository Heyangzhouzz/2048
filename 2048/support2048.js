function setCookie(cookieName, value, date) {
	document.cookie = cookieName + "=" + value + ";expires=" + date.toGMTString();
}

function getCookie(cookieName) {
	var cookie = document.cookie;
	var i = cookie.indexOf(cookieName);
	if(i == -1) {
		return null
	} else {
		var starti = i + cookieName.length + 1;
		var endi = cookie.indexOf(";", starti);
		if(endi == -1) {
			return cookie.slice(starti);
		} else {
			return cookie.slice(starti, endi);
		}
	}
}
var game = {
	RN: 4,
	CN: 4, //总函数和总列数
	data: null, //保存游戏格子数据的二维数组
	score: 0, //保存游戏得分
	state: 1, //保存游戏状态
	GAMEOVER: 0, //保存游戏结束状态
	RUNNING: 1, //保存游戏运行中
	top: 0, //保存游戏最高分
	
	start: function() { //启动游戏
		this.top = getCookie("top") || 0;
		this.state = this.RUNNING; 
		this.score = 0; 
		this.data = [];
		for(var r = 0; r < this.RN; r++) {
			this.data[r] = [];
			for(var c = 0; c < this.CN; c++) {
				this.data[r][c] = 0; 
			}
		} 
		this.randomNum();
		this.randomNum();
		this.updataView(); 

		var mouseHandler = function(evt) {
			if(evt.type == "mousedown") {
				mouseStartPoint = {
					x: evt.pageX,
					y: evt.pageY
				};
			}
			if(evt.type == "mouseup") {
				var xDistance = evt.pageX - mouseStartPoint.x;
				var yDistance = evt.pageY - mouseStartPoint.y;
				if(Math.abs(xDistance) + Math.abs(yDistance) > 20) {
					if(Math.abs(xDistance) >= Math.abs(yDistance)) {
						if(xDistance > 0) {
							this.moveRight();
						} else {
							this.moveLeft();
						}
					} else {
						if(yDistance > 0) {
							this.moveDown();
						} else {
							this.moveUp();
						}
					}
				}
			}
			evt.stopPropagation("");
		}.bind(this);
		var keyHandler = function(evt) {
			switch(evt.which) {
				case 38:
				case 87:
					this.moveUp();
					break;
				case 40:
				case 83:
					this.moveDown();
					break;
				case 37:
				case 65:
					this.moveLeft();
					break;
				case 39:
				case 68:
					this.moveRight();
					break;
			}
			evt.preventDefault();
		}.bind(this);
		$(document).on("keydown", keyHandler);
		$(document).on("mousedown", mouseHandler);
		$(document).on("mouseup", mouseHandler);
	},
	move: function(callback) {
		var before = String(this.data);
		callback();
		var after = String(this.data);
		if(before != after) {
			this.randomNum();
			if(this.isGameOver()) {
				this.state = this.GAMEOVER;
				if(this.score > this.top) {
					var now = new Date();
					now.setFullYear(now.getFullYear() + 1);
					setCookie("top", this.score, now);
				}

			}
			this.updataView();
		}
	},

	isGameOver: function() {
		for(var r = 0; r < this.RN; r++) {
			for(var c = 0; c < this.CN; c++) {
				if(this.data[r][c] == 0) {
					return false;
				} else if(c < this.CN - 1 && (this.data[r][c] == this.data[r][c + 1])) {
					return false;
				} else if(r < this.RN - 1 && (this.data[r][c] == this.data[r + 1][c])) {
					return false;
				}
			}
		} 
		return true;
	},
	/***************************向左****************************/
	moveLeft: function() { 
		this.move(function() {
			for(var r = 0; r < this.RN; r++) {
				this.moveLeftInRow(r);
			}
		}.bind(this));
	},

	moveLeftInRow: function(r) { 
		for(var c = 0; c < this.CN - 1; c++) {
			var nextc = this.getNextInRow(r, c);
			if(nextc == -1) {
				break;
			} else { 
				if(this.data[r][c] == 0) {
					this.data[r][c] = this.data[r][nextc];
					this.data[r][nextc] = 0;
					c--; 
				} else if(this.data[r][c] == this.data[r][nextc]) {
					this.data[r][c] *= 2;
					this.score += this.data[r][c];
					this.data[r][nextc] = 0;
				}
			}
		}
	},
	getNextInRow: function(r, c) {
		c++; 
		for(; c < this.CN; c++) {
			if(this.data[r][c] != 0) {
				return c;
			} 
		}
		return -1; 
	},
	/**********************向右***************************/
	moveRight: function() {
		this.move(function() {
			for(var r = 0; r < this.RN; r++) {
				this.moveRightInRow(r);
			}
		}.bind(this));
	},

	moveRightInRow: function(r) { 
		for(var c = this.CN - 1; c > 0; c--) {
			var prevc = this.getPrevInRow(r, c);

			if(prevc == -1) {
				break;
			} else { 
				if(this.data[r][c] == 0) {
					this.data[r][c] = this.data[r][prevc];
					this.data[r][prevc] = 0;
					c++;
				} else if
				(this.data[r][c] == this.data[r][prevc]) {
					this.data[r][c] *= 2;
					this.score += this.data[r][c];
					this.data[r][prevc] = 0;
				}
			}
		}
	},
	getPrevInRow: function(r, c) {
		c--; 
		for(; c >= 0; c--) {
			if(this.data[r][c] != 0) {
				return c;
			} 
		}
		return -1;
	},
	/***********************向上**************************/
	moveUp: function() { 
		this.move(function() {
			for(var c = 0; c < this.CN; c++) {
				this.moveUpInCol(c);
			}
		}.bind(this));
	},

	moveUpInCol: function(c) { 
		for(var r = 0; r < this.RN - 1; r++) {
			var nextr = this.getUpInCol(r, c);
			if(nextr == -1) {
				break;
			}
			else {
				if(this.data[r][c] == 0) {
					this.data[r][c] = this.data[nextr][c];
					this.data[nextr][c] = 0;
					r--;
				} else if(this.data[r][c] == this.data[nextr][c]) { 
					this.data[r][c] *= 2;
					this.score += this.data[r][c];
					this.data[nextr][c] = 0;
				}
			}
		}
	},
	getUpInCol: function(r, c) {
		r++;
		for(; r < this.RN; r++) {
			if(this.data[r][c] != 0) {
				return r;
			} 
		} 
		return -1;
	},

	/***********************向下***********************/
	moveDown: function() {
		this.move(function() {
			for(var c = 0; c < this.CN; c++) {
				this.moveDownInCol(c);
			}
		}.bind(this));
	},

	moveDownInCol: function(c) { 
		for(var r = this.RN - 1; r > 0; r--) {
			prevr = this.getPrevInCol(r, c);
			if(prevr == -1) {
				break;
			} else { 
				if(this.data[r][c] == 0) {
					this.data[r][c] = this.data[prevr][c];
					this.data[prevr][c] = 0;
					r++;
				} else if(
					this.data[r][c] == this.data[prevr][c]) {
					this.data[r][c] *= 2;
					this.score += this.data[r][c];
					this.data[prevr][c] = 0;
				}
			}
		}
	},
	getPrevInCol: function(r, c) {

		r--;
		for(; r >= 0; r--) {
			if(this.data[r][c] != 0) {
				return r;
			}
		}
		return -1;
	},

	/**********************更新页面**************************/
	updataView: function() {
		for(var r = 0; r < this.RN; r++) {
			for(var c = 0; c < this.CN; c++) {
				var div = document.getElementById("c" + r + c);
				if(this.data[r][c] != 0) {
					div.innerHTML = this.data[r][c];
					div.className = "cell n" + this.data[r][c];
				} else { 
					div.innerHTML = "";
					div.className = "cell";
				}
			}
		}
		$("#score").html(this.score);
		if(this.state == this.GAMEOVER) {
			$("#gameOver").css("display","block");
			$("#fScore").html(this.score);
		} else {
			$("#gameOver").css("display","none");
		}
		$("#topScore").html(this.top);
	},

	/**********************产生随机数**********************/
	getEmptyIndex: function () {
      var emptyBlockIndexs = []
      for(var r = 0; r < this.RN; r++) {
			for(var c = 0; c < this.CN; c++) {
				if(this.data[r][c] == 0) {
					emptyBlockIndexs.push([r,c]);
				} 
			}
		} 
      return { 
      		R:emptyBlockIndexs[Math.floor(Math.random() * emptyBlockIndexs.length)][0],
      		C:emptyBlockIndexs[Math.floor(Math.random() * emptyBlockIndexs.length)][1]
      }
    },
	randomNum: function() {
		var r = this.getEmptyIndex().R;
		var c = this.getEmptyIndex().C;
		if(this.data[r][c] == 0) {
			this.data[r][c] = Math.random() < 0.5 ? 2 : 4;
		}
	}
}
game.start();
$("#newGame").on("click",function(){
	game.start();
});
