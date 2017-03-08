"use strict";

let game = {
	cv: document.getElementById('cv'),
	states: ['wait','play','over'],
	p1: {},
	p2: {},
	ball: {},
	winScore: 5,
	playersVel: 10,
	ballMaxVelX: 15,
	keyboard: [],
	ballGoingUp: Math.random() < 0.5,
	drawObj: function(b){
		this.ctx.fillStyle = "white"
		this.ctx.fillRect(Math.round(b.posX-b.w/2),Math.round(b.posY-b.h/2),Math.round(b.w),Math.round(b.h))
	},
	drawScore: function(){
		this.ctx.font = '42px monospace'
		this.ctx.textAlign = 'right'
		this.ctx.fillStyle = 'white'
		this.ctx.textBaseline = 'bottom' // p1
		this.ctx.fillText(`${(this.p1.score>this.winScore-1) ? "wins!" : ""} ${this.p1.score}`, Math.round(this.cv.width /20*19),Math.round(this.cv.height/2))
		this.ctx.textBaseline = 'top' // p2
		this.ctx.fillText(`${(this.p2.score>this.winScore-1) ? "wins!" : ""} ${this.p2.score}`, Math.round(this.cv.width/20*19),Math.round(this.cv.height/2))
	},
	updateBall: function(){
		let b = this.ball
		if((b.posX + b.w/2) > this.cv.width){
			b.posX = this.cv.width - b.w/2
			b.velX *= -1
		}
		if((b.posX - b.w/2) < 0){
			b.posX = b.w/2
			b.velX *= -1
		}
		if(b.posY > (this.cv.height + b.h/2)){
			if(this.state === this.states[1]){
				this.p1.score++
				this.ballGoingUp = false
			}
			if(this.p1.score >= this.winScore){
				this.state = this.states[2]
			}
			else{
				this.state = this.states[0]
				this.update()
			}
		}
		if(b.posY < (-b.h/2)){
			if(this.state === this.states[1]){
				this.p2.score++
				this.ballGoingUp = true
			}
			if(this.p2.score >= this.winScore)
				this.state = this.states[2]
			else{
				this.state = this.states[0]
				this.update()
			}
		}
		b.posX += b.velX
		b.posY += b.velY
	},
	update: function(){
		this.cv.width = this.cv.width
		this.keyboardCheck()
		this.detectHit()
		this.drawScore()
		this.drawObj(this.ball)
		this.drawObj(this.p1)
		this.drawObj(this.p2)
		if(this.state === this.states[1]){
			this.updateBall()
		}
	},
	start: function(){
		if(this.winScore!==3)
			document.getElementById('score_to_win').innerHTML = this.winScore
		this.ctx = this.cv.getContext('2d')
		this.keyboard[37] = this.keyboard[39] = this.keyboard[65] = this.keyboard[68] = false
		this.restart();
	},
	restart: function(){
		this.resetPlayers()
		this.state = this.states[0]
	},
	resetBall: function(){
		this.ball = {
			posX: cv.width/2,
			posY: cv.height/2,
			velX: Math.floor( Math.random() * 8) * ( Math.random() < 0.5 ? -1 : 1 ),
			velY: 5 * (this.ballGoingUp ? -1 : 1),
			w: 20,
			h: 20
		}		
	},
	resetPlayers: function(){
		this.p1 = {
			posX: cv.width/2,
			posY: cv.height/20,
			w: 125,
			h: 20,
			score: 0
		}
		this.p2 = {
			posX: cv.width/2,
			posY: cv.height/20*19,
			w: 125,
			h: 20,
			score: 0
		}
	},
	keyboardCheck: function(){
		if(this.keyboard[37])
			if((this.p2.posX - (this.p2.w/2) - this.playersVel)<0)
				this.p2.posX = this.p2.w/2
			else
				this.p2.posX -= this.playersVel
		if(this.keyboard[39])
			if((this.p2.posX + (this.p2.w / 2) + this.playersVel) > this.cv.width)
				this.p2.posX = this.cv.width - (this.p2.w / 2)
			else
				this.p2.posX += this.playersVel
		if(this.keyboard[65])
			if((this.p1.posX - (this.p1.w / 2) - this.playersVel) < 0)
				this.p1.posX = this.p1.w / 2
			else
				this.p1.posX -= this.playersVel
		if(this.keyboard[68])
			if((this.p1.posX + (this.p1.w / 2) + this.playersVel) > this.cv.width)
				this.p1.posX = this.cv.width - (this.p1.w / 2)
			else
				this.p1.posX += this.playersVel
	},
	detectHit: function(){
		let b = this.ball
		if(this.ball.posY>this.cv.height/2){
			let p = this.p2
			if( ( (b.posY + ( b.h / 2 ) ) < p.posY ) && ( (b.posY + ( b.h / 2 ) ) > ( p.posY - (p.h / 2) ) ) ){
				let dist = p.posX - b.posX
				let max_dist = ( p.w / 2 ) + ( b.w / 2 )
				if( Math.abs(dist) < max_dist ){
					this.ball.posY = p.posY - (p.h / 2) - (b.h / 2)
					this.ball.velY = -b.velY
					this.ball.velX = ( ( dist * this.ballMaxVelX ) / max_dist ) * (-1)  
				}
			}
		} else {
			let p = this.p1
			if( ( ( b.posY - ( b.h / 2 ) ) > p.posY ) && ( ( b.posY - ( b.h / 2 ) ) < ( p.posY + (p.h / 2) ) ) ){
				let dist = p.posX - b.posX
				let max_dist = ( p.w / 2 ) + ( b.w / 2 )
				if( Math.abs(dist) < max_dist ){
					this.ball.posY = p.posY + ( p.h / 2 ) + ( b.h / 2 )
					this.ball.velY = -b.velY
					this.ball.velX = ( ( dist * this.ballMaxVelX ) / max_dist ) * (-1)  
				}
			}
		}
	}
}

let keyEventDown = window.addEventListener('keydown', function(e){
	let k = e.keyCode
	if((game.state === game.states[0]) && (k===32)){
		game.resetBall()
		game.state = game.states[1]
	} else if((game.state === game.states[2]) && (k===32)){
		game.start()
	} else if(k===37 || k===39 || k===65 || k===68){
		game.keyboard[k] = true
	}
})

let keyEventUp = window.addEventListener('keyup', function(e){
	let k = e.keyCode
	if(k===37 || k===39 || k===65 || k===68){
		game.keyboard[k] = false
	}
})

game.start();

(function run(){
	game.update()
	window.requestAnimationFrame(run)
}())
