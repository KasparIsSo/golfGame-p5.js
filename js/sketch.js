//golf sim
var wCheck = $(window).width();

if (wCheck <= 420) {
	var w = wCheck;
	var h = 3 * wCheck / 2;
} else {
	var w = 600;
	var h = 800;
}

var tile  = 20;
var tile2 = tile/4;

var col   = Math.ceil(w/tile) + 1;
var row   = Math.ceil(h/tile) + 1;

var inc   = .1;

var b, holeP;

var alw   = 10; //allowance
var end   = false; //endscreen

var noise2D = [];

var button;
var sFlow = false;

var strokeCount = 0;

var wEdge = w-tile2;
var hEdge = h-tile2;

function setup() {
	// c = createCanvas($(window).innerWidth(), $(window).innerHeight());

	c = createCanvas(w, h);
	c.parent("golfGame");
	c.id("golfGameCanvas");
	colorMode(HSB, 360, 100, 100);
	// background(0, 0, 15, 1);

	holeP = createVector( w/2, 4*tile );
	startGG();

	// button = createButton('Show<br>Grass<br>Flow');
	// button.id("ggButton");
	// button.position(w-100, h-100 );
	// button.size(60, 60);
	// button.mousePressed(showFlow);

	// c.appendChild(button);
	c.mouseReleased(mClicked);
	c.touchEnded(mClicked);

}

function draw() {
	// background(0, 0, 5, .1);
	// background(130, 50, 80);
	// background(115, 50, 88);
	background(115, 40, 88);

	stroke(255);
	strokeWeight(1);
	noFill();

	if(sFlow){
		for ( i = 0; i < noise2D.length; i++ ) {
			var tempX = i % col;
			var tempY = Math.floor(i / col);
			// console.log("x: " + tempX + " , y: " + tempY);
			push();
				translate( tempX * tile + .5 * tile , tempY * tile + .5 * tile );
				// translate( tempX * tile , tempY * tile );
				// rect(0, 0, tile, tile);
				rotate(noise2D[i].heading());
				arrow( 0, 0, tile, 0);
			pop();
		}

		// for ( y = 0; y < noise2D.length; y++ ) {
		// 	for( x = 0; x < noise2D[y].length; x++ ) {
		// 		push();
		// 			translate( x * tile + .5 * tile , y * tile + .5 * tile );
		// 			// noFill();
		// 			// rect(-.5 * tile, -.5 * tile, tile, tile);
		// 			rotate(noise2D[y][x].heading());
		// 			arrow( 0, 0, tile, 0);
		// 			// line( 0, 0, tile, 0 );
		// 		pop();
		// 		// console.log(mag(noise2D[y][x].x, noise2D[y][x].y));
		// 		// everything has equal force
		// 	}
		// }
	}

	noStroke();
	fill( 0, 0, 20);
	ellipse( holeP.x, holeP.y, tile, tile );

	b.disp();

	strokeWeight( 2 );
	stroke( 343, 93, 95 );
	if ( !b.go && !end ){
		if ( mag(mouseX - b.position.x, mouseY - b.position.y) < 100){
			line( b.position.x, b.position.y, mouseX, mouseY );
		} else {
			var mouseTempAngle = Math.atan2(mouseY - b.position.y, mouseX - b.position.x);
			line( b.position.x, b.position.y, 
				100 * cos(mouseTempAngle) + b.position.x, 
				100 * sin(mouseTempAngle) + b.position.y
			);
		}
	}
	// noLoop();
}

// $( window ).resize(function() {
// 	c.size($(window).innerWidth(), $(window).innerHeight());
// });

var ball = function() {
	this.r = tile/2;
	this.position = createVector( width/2, h - 4*tile );
	this.velocity = createVector( 0, 0 );
	this.go = false;
	this.decel = createVector( .06, .06);
	this.counter;
	this.pastPosition = this.position.copy();


	this.disp = function() {
		if ( this.go ) {
			this.update();
			this.check();
		}
		noStroke();
		fill(0, 0, 100);
		ellipse(this.position.x, this.position.y, this.r, this.r);
	}

	this.update = function() {
		this.position.x += this.velocity.x;
		this.position.y += this.velocity.y;
		// apply force
		// var tileX = Math.min(Math.abs(Math.floor(this.position.x / tile)), col-1);
		// var tileY = Math.min(Math.abs(Math.floor(this.position.y / tile)), row-1);
		var tileX = Math.abs(Math.floor(this.position.x / tile));
		var tileY = Math.abs(Math.floor(this.position.y / tile));
		var tilePos = tileY * col + tileX;

		if (this.velocity.x < 0 ){
			this.velocity.x *= .99;
		}
		if (this.velocity.x >= 0 ){
			this.velocity.x *= .99;
		}
		if (this.velocity.y >= 0 ){
			this.velocity.y *= .99;
		}
		if (this.velocity.y < 0 ){
			this.velocity.y *= .99;
		}

		if (mag(this.velocity.x, this.velocity.y) < 0.4 && this.counter > 3){
			this.velocity.x = 0;
			this.velocity.y = 0;

			this.pastPosition = this.position.copy();
		}

		if ( this.velocity.x == 0 && this.velocity.y == 0 ){
			this.go = false;
		}

		//out of bounds +2
		// if (this.position.x > w || 
		// 	this.position.x < 0 ||
		// 	this.position.y > h || 
		// 	this.position.y < 0){
		// 	strokeCount ++;
		// 	$('#strokeCount').html("Stroke: "+strokeCount); 
		// 	this.position = this.pastPosition.copy();
		// 	this.velocity = createVector(0, 0);
		// } else {
		// 	this.counter += .1;
		// 	this.velocity.x += .1 * noise2D[tileY][tileX].x / this.counter;
		// 	this.velocity.y -= .1 * noise2D[tileY][tileX].y / this.counter;
		// }

		//bounce those balls
		if ( this.position.x >= wEdge ) {
			this.velocity.x = -1 * Math.abs(this.velocity.x);
		}
		if ( this.position.x <= tile2 ) {
			this.velocity.x = Math.abs(this.velocity.x);
		}
		if ( this.position.y >= hEdge ) {
			this.velocity.y = -1 * Math.abs(this.velocity.y);
		}
		if ( this.position.y <= tile2 ) {
			this.velocity.y = Math.abs(this.velocity.y);
		}

		// console.log(this.position.x);
		// console.log("y" + this.position.y);
		this.counter += .15;
		// this.velocity.x += .1 * noise2D[tileY][tileX].x / this.counter;
		// this.velocity.y += .1 * noise2D[tileY][tileX].y / this.counter;
		this.velocity.x += .1 * noise2D[tilePos].x / this.counter;
		this.velocity.y += .1 * noise2D[tilePos].y / this.counter;

		
	}

	this.check = function() {
		if ( Math.abs(this.position.y - holeP.y) <= alw ) {
			if ( Math.abs(this.position.x - holeP.x) <= alw ) {
				this.r = 0;
				this.go = false;
				showEnd();
			}
		}
	}

}


function mClicked() {
	if ( !b.go ) {
		b.go = true;
		if (mag(mouseX - b.position.x, mouseY - b.position.y) < 100){
			b.velocity = createVector(
				(mouseX - b.position.x) * .1, 
				(mouseY - b.position.y) * .1
			);
		} else {
			var mouseTempAngle = Math.atan2(mouseY - b.position.y, mouseX - b.position.x);
			b.velocity = createVector(
				(100 * cos(mouseTempAngle)) * .1, 
				(100 * sin(mouseTempAngle)) * .1
			);
		}
		b.counter = 1;
		strokeCount ++;
		$('#strokeCount').html("Stroke: "+strokeCount); 
	}
}


function loadNoise() {
	noise2D = [];
	// inc = Math.random(20);
	var lrRandom = Math.round(Math.random()) + Math.random()/20;
	for ( y = 0; y < row; y++ ) {
		// var temp = [];
		for ( x = 0; x < col; x++ ) {
			var r = noise( x * inc, y * inc ) * PI/4 + lrRandom * PI;
			var v = p5.Vector.fromAngle(r);
			// temp.push(v);
			noise2D.push(v);
		}
		// noise2D.push(temp);
	}
	strokeCount = 0;
}

function arrow( x1, y1, x2, y2 ) {
	line(x1, y1, x1 - 8, y1 + 4);
	line(x1, y1, x1 - 8, y1 - 4);
}

$('#showSwitch').change(function() {
	sFlow = !sFlow;      
});

var strokeConvertor = [
	"Hole in One",
	"Birdie",
	"Par",
	"Bogey",
	"Double-Bogey",
	"Triple-Bogey"
]

function showEnd() {
	if ( (strokeCount-1) < strokeConvertor.length) {
		$('#fStrokeC').html(strokeConvertor[strokeCount-1]); 
	} else {
		$('#fStrokeC').html((strokeCount-2) + "-over-par"); 
	}

	$('#endScreenBG').fadeToggle( 400, "linear" );
}

function startGG() {
	b = new ball();
	loadNoise();
	strokeCount = 0;
	$('#strokeCount').html("Stroke: "+strokeCount); 
}

function restartGG() {
	startGG();
	$('#endScreenBG').fadeToggle( 400, "linear" );

}




