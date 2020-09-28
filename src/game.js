var EmptyScene = new Phaser.Class({
	Extends: Phaser.Scene,
	initialize: function EmptyScene() {
		Phaser.Scene.call(this, {key: 'empty_scene'});
	},

	preload: function () {
		this.load.spritesheet('pacman', 'https://i.imgur.com/apbA01B.png', {frameWidth: 13, frameHeight: 13});
	},

	create: function () {
		var pacman = new Enemy(this, 100, 100);
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