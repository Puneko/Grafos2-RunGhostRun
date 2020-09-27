var EmptyScene = new Phaser.Class({
	Extends: Phaser.Scene,
	initialize: function EmptyScene() {
		Phaser.Scene.call(this, {key: 'empty_scene'});
	},

	preload: function () {
		console.log('Nothing.')
	},

	create: function () {
		console.log('Nothing.')
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