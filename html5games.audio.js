var audiogame = {};
//主游戏canvas
var game = {};

/************   game init   *************/
$(function(){
	audiogame.buttonOverSound = document.getElementById('buttonover');
	audiogame.buttonOverSound.volume = 0.3;
	audiogame.buttonActiveSound = document.getElementById('buttonactive');
	audiogame.buttonActiveSound.volume = 0.3;
	audiogame.melody = document.getElementById('melody');
	audiogame.base = document.getElementById('base');
	
	//记录切换记录模式和正常播放模式
	audiogame.isRecordMode = false;

	//存储所有音符数据的数组
	audiogame.musicNotes = [];
	audiogame.leveldata = "1.592,3;1.984,2;2.466,1;2.949,2;4.022,3;4.443,2;4.594,1;5.498,3;5.92,2;6.04,1;7.034,2;7.395,3;7.968,2;8.45,1;8.962,2;10.018,3;10.258,2;10.44,2;10.711,1;10.977,2;11.556,3;12.008,1;13.588,3;14.013,2;14.495,1;14.946,2;16.003,3;16.395,2;16.546,1;17.48,3;17.85,2;18.001,1;19.026,2;19.508,3;19.96,2;20.412,1;20.955,2;22.01,3;22.252,2;22.432,2;22.673,1;23.518,3;23.788,2;24.029,1;25.024,3;25.506,2;26.019,1;26.531,2;27.043,3;28.038,3;28.52,2;28.972,1;29.454,2;29.967,3;30.51,2;31.022,3;31.474,2;31.956,3;32.408,2;32.89,3;33.433,2;34.006,3;34.398,2;34.518,1;35.453,3;35.875,2;36.026,1;37.111,2;37.504,3;38.016,1;38.529,3;38.981,2;39.524,3;40.007,2;40.459,1;40.971,2;41.483,3;41.936,2;42.448,1;42.992,2;43.444,3;43.956,2;44.378,3;44.92,2;45.945,3;46.337,2;46.488,1;47.513,3;47.875,2;47.995,1;49.141,2;49.533,3;50.045,2;50.557,1;51.039,2;51.521,3;52.004,2;52.486,1;52.998,2;53.481,3;53.993,2;54.505,1;54.988,2;55.44,3;55.952,2;56.434,3;56.916,2;57.429,1;57.911,2;58.454,3;58.966,2;59.539,3;60.051,2;61.256,3;61.739,2;62.222,1;62.704,2;63.216,3;63.699,2;64.212,1;64.755,2;65.267,3;65.749,2;66.261,3;66.743,2;67.256,3;67.738,2;68.251,1;68.764,2;69.247,3;69.729,2;70.271,3;70.753,2;71.265,1;71.717,2;72.289,3;73.223,3;73.736,2;74.249,1;74.731,2;75.274,3;75.756,2;76.268,3;76.78,2;77.262,3;77.744,2;78.257,3;78.77,2;79.252,1;79.765,2;80.277,3;80.729,2;81.241,1;81.754,2;82.266,3;82.779,3;83.261,2;83.744,1;84.256,2;84.799,3;85.643,3;86.276,2;86.758,3;87.24,2;87.722,3;88.236,2;88.778,1;89.26,2;89.773,3;90.256,2;90.708,1;91.191,2;91.763,3;92.216,2;92.729,3;93.241,2;93.753,1;94.235,3;94.748,3;95.29,2;95.742,3;96.224,2;96.827,3;97.671,3;98.334,3;98.906,3;100.022,3;100.444,2;100.564,1;101.468,3;101.859,2;102.01,1;102.975,2;103.367,3;103.518,2;103.88,3;104.031,2;104.393,3;104.544,2;104.905,3;105.057,2;105.961,3;106.205,2;106.416,2;106.657,1;106.928,2;107.169,3;107.441,2;107.712,1;107.984,3;108.527,2;109.009,1;109.401,2;109.521,3;110.034,2;110.546,3;111.029,2;111.964,3;112.084,2;112.265,1;112.416,2;112.988,3;113.501,3;113.892,2;114.043,1;114.525,2;115.037,3;115.399,2;115.55,1;115.852,3;116.002,2;116.365,3;116.485,2;116.847,3;116.998,2;117.963,3;118.354,2;118.506,1;119.503,3;119.865,2;120.015,1;";

	audiogame.totalDotsCount = 0;
	audiogame.totalSuccessCount = 0;
	//存储最近5个结果的成功计数
	audiogame.successCount = 15;
	//在Canvas上绘制的可视化点
	audiogame.dots = [];
	//存储开始时间
	audiogame.startingTime = 0;
	//音乐点图像引用
	audiogame.dotImage = new Image();
	audiogame.dotImage.src = 'images/dot.png';
	//主canvas
	game = document.getElementById('game-canvas');


	//menu ready
	var $playBtn = $('a[href=#game]');
	$playBtn.hover(function(){
		audiogame.buttonOverSound.currentTime = 0;
		audiogame.buttonOverSound.play();
	},function(){
		audiogame.buttonOverSound.pause();
	});
	$playBtn.click(function(){
		audiogame.buttonActiveSound.currentTime = 0;
		audiogame.buttonActiveSound.play();

		$('#game-scene').addClass('show-scene');
		startGame();	//开始游戏的入口
		return false;
	});
	//游戏键盘绑定，注意只能绑定一次
	keybordHandler();	
	//游戏接触监听
	$(audiogame.melody).bind('ended',onMelodyEnded);

});


var drawBackground = function(){
	var bgCanvas = document.getElementById('game-background-canvas'),
		ctx = bgCanvas.getContext('2d'),
		center = game.width/2;

	ctx.lineWidth = 10;
	ctx.strokeStyle = '#000';
	//左竖线
	ctx.beginPath();
	ctx.moveTo(center-100,50);
	ctx.lineTo(center-100,game.height-50);
	ctx.stroke();
	//中线
	ctx.beginPath();
	ctx.moveTo(center,50);
	ctx.lineTo(center,game.height-50);
	ctx.stroke();
	//右竖线
	ctx.beginPath();
	ctx.moveTo(center+100,50);
	ctx.lineTo(center+100,game.height-50);
	ctx.stroke();
	//横线
	ctx.beginPath();
	ctx.moveTo(center-150,game.height-80);
	ctx.lineTo(center+150,game.height-80);
	ctx.lineWidth = 1;
	ctx.strokeStyle = 'rgba(50,50,50,.8)';
	ctx.stroke();

}

var setupLevelData = function(){
	audiogame.leveldata = localStorage.getItem('noteData') || audiogame.leveldata;
	var notes = audiogame.leveldata.split(';'),
		note,time,line,musicNote;
	audiogame.totalDotsCount = notes.length;
	for(var i in notes){
		note = notes[i].split(',');
		time = parseFloat(note[0]);
		line = parseFloat(note[1]);
		musicNote = new MusicNote(time,line);
		audiogame.musicNotes.push(musicNote);
	}
}

var startGame = function(){
	//绘制背景层canvas
	drawBackground();
	//[Warning]游戏键盘控制不能放到这里，因为如果restart方法会再调用一次startGame，导致再绑定一次事件监听，逻辑就重复两次而发生记录音乐点出错
	//keybordHandler();	
	//在播放模式下才执行游戏循环
	if(!audiogame.isRecordMode){
		//解析音乐点数据
		setupLevelData();
		//启动游戏主循环
		audiogame.gameInterval = setInterval(gameloop,30);
	}else{
		clearInterval(audiogame.gameInterval);
	}
	
	//播放音乐（在启动游戏主循环的时间之后）
	audiogame.startingTime = new Date().getTime();
	setTimeout(playMusic,3550);
}

var playMusic = function(){
	audiogame.melody.play();
	audiogame.base.play();
}

var restartGame = function(){
	audiogame.melody.currentTime = 0;
	audiogame.base.currentTime = 0;
	audiogame.melody.pause();
	audiogame.base.pause();
	audiogame.dots = [];
	audiogame.musicNotes = [];
	gameloop();		//手动继续gameloop一次，让画面强制清掉音乐点
	startGame();	
}

var keybordHandler = function(){
	//按键事件
	$(document).keydown(function(e){
		//按下Enter切换录音模式和播放游戏模式,并且如果是在录音模式下Enter会把记录的音节保存
		if(e.which == 13){
			//录音模式下结束保存音节
			if(audiogame.isRecordMode){
				var musicNotesString = "";
				for(var i in audiogame.musicNotes){
					musicNotesString += audiogame.musicNotes[i].time + ',' + audiogame.musicNotes[i].line+';';
				}
				console.log(musicNotesString);
				localStorage.setItem('noteData',musicNotesString);
			}

			//切换游戏模式
			audiogame.isRecordMode = !audiogame.isRecordMode;
			restartGame();
		}

		if(audiogame.isRecordMode){
			/****************	录音模式	******************/
			
			//真正录音功能
			var currentTime = parseInt(audiogame.melody.currentTime*1000)/1000;
			var hitLineNum = getLineNum(e);
			if( hitLineNum < 1 || hitLineNum > 3) return;
			var note = new MusicNote(currentTime,hitLineNum);
			audiogame.musicNotes.push(note);

		}else{
			/****************	播音模式	******************/
			var hitLineNum = getLineNum(e);
			var $line = $('#hit-line-'+ hitLineNum);
			$line.removeClass('hide').addClass('show');
			
			for(var i in audiogame.dots){
				//击中音乐点
				if(hitLineNum == audiogame.dots[i].line && Math.abs(audiogame.dots[i].distance)<20){
					audiogame.dots.splice(i,1);

					audiogame.successCount++;
					audiogame.successCount = Math.min(15,audiogame.successCount);
					audiogame.totalSuccessCount++;
				}
			}

		}

		
	});

	$(document).keyup(function(e){
		var hitLineNum = getLineNum(e);
		var $line = $('#hit-line-'+ hitLineNum);
		$line.removeClass('show').addClass('hide');
	});
}

//游戏主循环
var gameloop = function(){
	var ctx = game.getContext('2d');

	if(audiogame.startingTime != 0){
		for(var i in audiogame.musicNotes){
			//计算从旋律开始时间与当前时间之间所流逝的时间
			var elapsedTime = (new Date().getTime() - audiogame.startingTime)/1000;
			var note = audiogame.musicNotes[i];
			//检测音乐点出现的时间是否与流逝的时间一样
			var timeDiff = note.time - elapsedTime;
			if(timeDiff >= 0 && timeDiff <= .03){
				//当出现时间处于两帧的流逝时间之间时，就创建一个音乐点
				var dot = new Dot(game.height-150,note.line);
				audiogame.dots.push(dot);
			}
			
		}
	}

	//检测丢失的音乐点
	for(var i in audiogame.dots){
		if(!audiogame.dots[i].miessed && audiogame.dots[i].distance < -10){
			audiogame.dots[i].misssed = true;
			audiogame.successCount--;
			audiogame.successCount = Math.max(0,audiogame.successCount);
		}
		//丢失的音乐点移动到底部后将其移除
		if(audiogame.dots[i].distance < -50){
			audiogame.dots.splice(i,1);
		}
	}

	var successPercent = audiogame.successCount/5;
	successPercent = Math.max(0,Math.min(1,successPercent));	//防止成功率超长百分比

	//最后根据成功率来调整旋律音乐，当为0的时候就没有声音了
	audiogame.melody.volume = successPercent;


	//移动音乐节点
	for(var i in audiogame.dots){
		audiogame.dots[i].distance -=2.5;
	}
	//只清除主游戏区域（发生更新区域），也就是中间区域
	ctx.clearRect(game.width/2-200,0,400,game.height);

	for(var i in audiogame.dots){
		//使用径向渐变来填充样式
		var circle_gradient = ctx.createRadialGradient(-3,-3,1,0,0,20);
		circle_gradient.addColorStop(0,'#fff');
		circle_gradient.addColorStop(1,'#cc0');
		ctx.fillStyle = circle_gradient;

		//准备要绘制的音乐点的位置
		ctx.save();	//保存canvas上下文
		var center =  game.width/2,
			dot = audiogame.dots[i],
			x = center - 100;
		if(dot.line == 2){
			x = center;
		}else if(dot.line == 3){
			x = center+100;
		}
		//根据所在的竖线和距离，在特定的位置绘制音乐点
		ctx.translate(x,game.height-80-audiogame.dots[i].distance);		//canvas上下文偏移
		ctx.drawImage(audiogame.dotImage, -audiogame.dotImage.width/2,-audiogame.dotImage.height/2);
		ctx.restore();	//恢复canvas上下文
	}

	

}

var onMelodyEnded = function(){
	console.log('---- song ended ----');
	console.log('success percent: ', audiogame.totalSuccessCount/audiogame.totalDotsCount*100+'%');
}


/************   game obj   *************/
function MusicNote(time,line){
	this.time = time;
	this.line = line;
}
function Dot(distance,line){
	this.distance = distance;
	this.line = line;
	this.missed = false;
}


/************   game utils   *************/
var getLineNum = function(event){

	return event.which== 40 ? 2 : event.which -36;
}
