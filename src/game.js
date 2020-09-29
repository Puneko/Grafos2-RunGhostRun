var Stage_1 = new Phaser.Class({
	Extends: Phaser.Scene,
	initialize: function Stage_1() {
		Phaser.Scene.call(this, {key: 'stage_1'});
	},

	preload: function () {
		this.load.spritesheet('pacman', 'https://i.imgur.com/XCYBO4y.png', {frameWidth: 52, frameHeight: 52});

		this.load.image('grid_bg', 'https://i.imgur.com/IH2Xlq7.png');
		this.load.image('node_trigger', 'assets/circle.png');
		this.load.image('pactileset', 'https://i.imgur.com/0nTnnpf.png');

		this.load.tilemapTiledJSON('stage_1', 'src/stages/stage_1.json');

		this.load.audio('snake', 'https://dl.dropbox.com/s/g4axwvihpfedjou/snake%3F.ogg');
	},

	create: function () {
		this.stage = new Stage(this, 'stage_1', 'pactileset');

		var dummy_target = this.physics.add.image(this.stage.player_spawn_point.x, this.stage.player_spawn_point.y, 'nothing');
		dummy_target.setCollideWorldBounds(true);
		dummy_target.entity = dummy_target;

		this.pacman = new Enemy(this, this.stage.pacman_spawn_point.x, this.stage.pacman_spawn_point.y, dummy_target);

		this.stage.setPlayer(dummy_target);
		this.stage.setPacman(this.pacman);

		game.canvas.addEventListener('mousedown', function () {
			game.input.mouse.requestPointerLock();
		});

		this.input.on('pointermove', (e) => {
			dummy_target.setVelocityX(e.movementX * 4);
			dummy_target.setVelocityY(e.movementY * 4);
		});

		this.input.on('pointerwheel', (e) => {
			this.pacman.target.destroy();
			this.pacman.target = null;
		});

		this.cameras.main.setZoom(4);
		this.cameras.main.startFollow(dummy_target);
	},

	update: function() {
		this.pacman.update();
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
    scene: [Stage_1],
    pixelArt: true
};

var game = new Phaser.Game(config);
