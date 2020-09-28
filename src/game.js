var EmptyScene = new Phaser.Class({
	Extends: Phaser.Scene,
	initialize: function EmptyScene() {
		Phaser.Scene.call(this, {key: 'empty_scene'});
	},

	preload: function () {
		this.load.spritesheet('pacman', 'https://i.imgur.com/apbA01B.png', {frameWidth: 13, frameHeight: 13});
	},

	create: function () {
		var dummy_target = this.add.image(this.input.activePointer.x, this.input.activePointer.y, 'nothing');
		this.pacman = new Enemy(this, 100, 100, dummy_target);

		this.input.on('pointermove', (e) => {
			dummy_target.x = e.position.x;
			dummy_target.y = e.position.y;
		});

		this.input.on('pointerup', (e) => {
			this.pacman.target.destroy();
			this.pacman.target = null;
		});
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
    scene: [EmptyScene],
    pixelArt: true
};

var game = new Phaser.Game(config);