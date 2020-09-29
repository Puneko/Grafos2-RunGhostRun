var EmptyScene = new Phaser.Class({
	Extends: Phaser.Scene,
	initialize: function EmptyScene() {
		Phaser.Scene.call(this, {key: 'empty_scene'});
	},

	preload: function () {
		this.load.spritesheet('pacman', 'https://i.imgur.com/XCYBO4y.png', {frameWidth: 52, frameHeight: 52});
		this.load.image('grid_bg', 'https://i.imgur.com/IH2Xlq7.png');
		this.load.audio('snake', 'https://dl.dropbox.com/s/g4axwvihpfedjou/snake%3F.ogg');
		this.load.spritesheet('ghost', 'https://i.imgur.com/LQmi5bg.png', {frameWidth: 28, frameHeight: 28});
	},

	create: function () {
		this.add.image(0, 0, 'grid_bg').setOrigin(0);
		var dummy_target = this.physics.add.image(this.input.activePointer.x, this.input.activePointer.y, 'nothing');
		dummy_target.setCollideWorldBounds(true);
		this.ghost = new Player(this, 400, 400);
		this.pacman = new Enemy(this, 100, 100, this.ghost.entity);
		
		game.canvas.addEventListener('mousedown', function () {
			game.input.mouse.requestPointerLock();
		});

		this.input.on('pointermove', (e) => {
			dummy_target.x += e.movementX/8;
			dummy_target.y += e.movementY/8;
		});

		this.input.on('pointerwheel', (e) => {
			this.pacman.target.destroy();
			this.pacman.target = null;
		});

		this.cameras.main.setZoom(4);
		this.cameras.main.startFollow(this.ghost.entity);
	},

	update: function() {
		this.pacman.update();
		this.ghost.update();
	}
});

var config = {
    type: Phaser.AUTO,
    width: 1280,
    height: 720,
    physics: {
    	default: 'arcade',
    	arcade: {
    		gravity: {y: 100},
    		debug: false
    	}
    },
    scene: [EmptyScene],
    pixelArt: true
};

var game = new Phaser.Game(config);
