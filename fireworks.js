var easter_egg = new Konami(function(){
ga('send', 'event', 'Secret', 'activate','konami');
	var obama = $('<img src="obama.png" style="position:fixed;left:0;right:0;margin:auto;bottom:-550">')
	$("body").append(obama);
	obama.animate({"bottom": "-300"},2000,"linear",function(){
		setTimeout(function(){
			obama.animate({"bottom": "-550"},2000,"linear");
		}, 2000);
	}
	);
});


$('body').click(function() {
ga('send', 'event', 'Secret', 'activate','eagle');
   if (!$("#loaddiv").is(":visible") && !$("#annoydiv").is(":visible")){
   var top = $(window).height()*Math.random();
   var bottom = $(window).height() - top;
   var eagle = $('<img src="eagle.gif" style="position:fixed;left:-250;top:'+top+';bottom:'+bottom+';margin:auto">')
   $("body").append(eagle);
   eagle.animate({"left": "100%"},2000,"swing",function(){
		 $(this).remove();
		}
   );
   var sound = new Howl({
	urls: ['eagle.wav'],
	autoplay:true,
	volume:2
   });
   }
});


var sound = new Howl({
  urls: ['starspangledbanner.mp3'],
  loop:true,
  autoplay:true,
  volume: 2,
  
  onplay: function(){
	if( /iPhone|iPad|iPod/.test(navigator.userAgent) ) {
		$('*').css('cursor', 'pointer');
		$(document.body).append('<div style="position:fixed;width:100%;height:100%;z-index:1000;top:0px;left:0px;display:table" id="annoydiv"><div style="text-align:center;display:table-cell;vertical-align:middle"><h1 style="color:darkgreen;font-family:sans-serif;font-size:5vh">TAP YOUR SCREEN NOW TO ENABLE SOUND</h1></div></div>');
		$("#annoydiv").click(function(){
			$("#annoydiv").hide();
		});
	}
	$('#loaddiv').hide();
  },

  
});


$('html, body').css({
    'overflow-x': 'hidden',
	'overflow-y': 'hidden',
    'height': '100%'
});
var SCREEN_WIDTH = window.innerWidth,
    SCREEN_HEIGHT = window.innerHeight,
    mousePos = {
        x: 400,
        y: 300
    },

    // create canvas
    canvas = document.createElement('canvas'),
    context = canvas.getContext('2d'),
    particles = [],
    rockets = [],
    MAX_PARTICLES =400,
    colorCode = 0;

// init
$(document).ready(function() {
    document.body.appendChild(canvas);
    canvas.width = SCREEN_WIDTH;
    canvas.height = SCREEN_HEIGHT;
    setInterval(launch,400);
    setInterval(loop, 1000 / 50);
	/*
	imageObj = new Image();
      imageObj.onload = function() {
        var pattern = context.createPattern(imageObj, 'no-repeat');

        context.rect(0, 0, canvas.width, canvas.height);
        context.fillStyle = pattern;
        context.fill();
      };
      imageObj.src = 'american-flag-bg.jpg';
	 */
});

// update mouse position
$(document).mousemove(function(e) {
    e.preventDefault();
    mousePos = {
        x: e.clientX,
        y: e.clientY
    };
});

// launch more rockets!!!
/*
$(document).mousedown(function(e) {
    for (var i = 0; i < 5; i++) {
        launchFrom(Math.random() * SCREEN_WIDTH * 2 / 3 + SCREEN_WIDTH / 6);
    }
});
*/

function launch() {
   //launchFrom(Math.random() * SCREEN_WIDTH * 2 / 3 + SCREEN_WIDTH / 6);
   launchFrom(Math.random()*SCREEN_WIDTH);
}

function launchFrom(x) {
    if (rockets.length < 15) {
        var rocket = new Rocket(x);
        /* rocket.explosionColor = Math.floor(Math.random() * 360 / 10) * 10;*/
		rocket.explosionColor = [[224,22,43],[255,255,255],[0,82,165]][Math.floor(Math.random() * 3)];
        if( SCREEN_HEIGHT/SCREEN_WIDTH < 1 ) {
			rocket.vel.y = Math.random() * -3 - 4;
			rocket.vel.x = Math.random() * 6 - 3;
		}
		else{
		console.log("fjgjg");
			rocket.vel.y = Math.random() * -6 - 4;
			rocket.vel.x = Math.random() * 6 - 3;
		}
        rocket.size = 4;
        rocket.shrink = 0.99;
        rocket.gravity = 0.01;
        rockets.push(rocket);
    }
}

function loop() {
    // update screen size
    if (SCREEN_WIDTH != window.innerWidth) {
        canvas.width = SCREEN_WIDTH = window.innerWidth;
    }
    if (SCREEN_HEIGHT != window.innerHeight) {
        canvas.height = SCREEN_HEIGHT = window.innerHeight;
    }

    // clear canvas
	/*
    context.fillStyle = imageObj;
    context.fillRect(0, 0, SCREEN_WIDTH, SCREEN_HEIGHT);
	*/	
	context.clearRect(0, 0, canvas.width, canvas.height);
    var existingRockets = [];

    for (var i = 0; i < rockets.length; i++) {
        // update and render
        rockets[i].update();
        rockets[i].render(context);

        // calculate distance with Pythagoras
        var distance = Math.sqrt(Math.pow(mousePos.x - rockets[i].pos.x, 2) + Math.pow(mousePos.y - rockets[i].pos.y, 2));

        // random chance of 1% if rockets is above the middle
        var randomChance = rockets[i].pos.y < (SCREEN_HEIGHT * 2 / 3) ? (Math.random() * 100 <= 1) : false;

/* Explosion rules
             - 80% of screen
            - going down
            - close to the mouse
            - 1% chance of random explosion
        */
        if (rockets[i].pos.y < SCREEN_HEIGHT / 5 || rockets[i].vel.y >= 0 || distance < 50 || randomChance) {
            rockets[i].explode();
        } else {
            existingRockets.push(rockets[i]);
        }
    }

    rockets = existingRockets;

    var existingParticles = [];

    for (var i = 0; i < particles.length; i++) {
        particles[i].update();

        // render and save particles that can be rendered
        if (particles[i].exists()) {
            particles[i].render(context);
            existingParticles.push(particles[i]);
        }
    }

    // update array with existing particles - old particles should be garbage collected
    particles = existingParticles;

    while (particles.length > MAX_PARTICLES) {
        particles.shift();
    }
}

function Particle(pos) {
    this.pos = {
        x: pos ? pos.x : 0,
        y: pos ? pos.y : 0
    };
    this.vel = {
        x: 0,
        y: 0
    };
    this.shrink = .97;
    this.size = 2;

    this.resistance = 1;
    this.gravity = 0;

    this.flick = false;

    this.alpha = 1;
    this.fade = 0;
    this.color = 0;
}

Particle.prototype.update = function() {
    // apply resistance
    this.vel.x *= this.resistance;
    this.vel.y *= this.resistance;

    // gravity down
    this.vel.y += this.gravity;

    // update position based on speed
    this.pos.x += this.vel.x;
    this.pos.y += this.vel.y;

    // shrink
    this.size *= this.shrink;

    // fade out
    this.alpha -= this.fade;
};

Particle.prototype.render = function(c) {
    if (!this.exists()) {
        return;
    }

    c.save();

    c.globalCompositeOperation = 'lighter';

    var x = this.pos.x,
        y = this.pos.y,
        r = this.size / 2;

    var gradient = c.createRadialGradient(x, y, 0.1, x, y, r);
    gradient.addColorStop(0.1, "rgba(255,255,255," + this.alpha + ")");
    gradient.addColorStop(0.8, "rgba(" + this.color[0].toString() +","+this.color[1].toString()+","+this.color[2].toString()+"," + this.alpha + ")");
    gradient.addColorStop(1, "rgba(" + this.color[0].toString() +","+this.color[1].toString()+","+this.color[2].toString()+", 0.1)");

    c.fillStyle = gradient;

    c.beginPath();
    c.arc(this.pos.x, this.pos.y, this.flick ? Math.random() * this.size : this.size, 0, Math.PI * 2, true);
    c.closePath();
    c.fill();

    c.restore();
};

Particle.prototype.exists = function() {
    return this.alpha >= 0.1 && this.size >= 1;
};

function Rocket(x) {
    Particle.apply(this, [{
        x: x,
        y: SCREEN_HEIGHT}]);

    this.explosionColor = 0;
}

Rocket.prototype = new Particle();
Rocket.prototype.constructor = Rocket;

Rocket.prototype.explode = function() {
    var count = Math.random() * 10 + 80;
	var sound = new Howl({
		urls: ['firework_explode.mp3'],
		volume:10,
		autoplay:true
	});
    for (var i = 0; i < count; i++) {
        var particle = new Particle(this.pos);
        var angle = Math.random() * Math.PI * 2;

        // emulate 3D effect by using cosine and put more particles in the middle
        var speed = Math.cos(Math.random() * Math.PI / 2) * 15;

        particle.vel.x = Math.cos(angle) * speed;
        particle.vel.y = Math.sin(angle) * speed;

        particle.size = 10;

        particle.gravity = 0.2;
        particle.resistance = 0.92;
        particle.shrink = Math.random() * 0.05 + 0.93;

        particle.flick = true;
        particle.color = this.explosionColor;

        particles.push(particle);
    }
};

Rocket.prototype.render = function(c) {
    if (!this.exists()) {
        return;
    }

    c.save();

    c.globalCompositeOperation = 'lighter';

    var x = this.pos.x,
        y = this.pos.y,
        r = this.size / 2;

    var gradient = c.createRadialGradient(x, y, 0.1, x, y, r);
    gradient.addColorStop(0.1, "rgba(255, 255, 255 ," + this.alpha + ")");
    gradient.addColorStop(1, "rgba(0, 0, 0, " + this.alpha + ")");

    c.fillStyle = gradient;

    c.beginPath();
    c.arc(this.pos.x, this.pos.y, this.flick ? Math.random() * this.size / 2 + this.size / 2 : this.size, 0, Math.PI * 2, true);
    c.closePath();
    c.fill();

    c.restore();
};
