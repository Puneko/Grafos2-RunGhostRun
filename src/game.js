var Stage_1 = new Phaser.Class({
	Extends: Phaser.Scene,
	initialize: function Stage_1() {
		Phaser.Scene.call(this, {key: 'stage_1'});
	},

	create: function () {
		this.stage = new Stage(this, 'stage_1', 'pactileset');

		this.ghost = new Player(this, this.stage.player_spawn_point.x, this.stage.player_spawn_point.y);
		this.pacman = new Enemy(this, this.stage.pacman_spawn_point.x, this.stage.pacman_spawn_point.y, this.ghost);

		this.stage.setPacman(this.pacman);
		this.stage.setPlayer(this.ghost);
		this.stage.generateEvents();

		game.canvas.addEventListener('mousedown', function () {
			game.input.mouse.requestPointerLock();
		});

		this.cameras.main.setZoom(4);
		this.cameras.main.startFollow(this.ghost.entity);
	},

	update: function() {
		this.pacman.update();
		this.ghost.update();
	}
});

var Game_Over = new Phaser.Class({
	Extends: Phaser.Scene,
	initialize: function Game_Over() {
		Phaser.Scene.call(this, {key: 'game_over'});
	},

	create: function () {
		let game_over = this.sound.add('gameover');
		let pacman = this.add.image(640, 360, 'game_over_pacman');

		game_over.play();
		this.tweens.add({
			targets: pacman,
			duration: 5000,
			scale: 1.2
		}).on('complete', () => {
			let pacman_reach = this.add.image(340, 360, 'pacman_hand');
			pacman_reach.setScale(0);

			let reach_tween = this.tweens.add({
				targets: pacman_reach,
				duration: 200,
				delay: 1000,
				scale: 10,
				x: 640,
				ease: 'Sine.easeIn',
				paused: true
			});

			reach_tween.on('start', () => {
				pacman_reach.setScale(0.25);
			});

			reach_tween.on('complete', () => {
				pacman.destroy();
				pacman_reach.destroy();

				pacman = pacman_reach = null;
				game_over.stop();
				this.sound.add('crack').play();

				let game_over_screen = this.add.image(0, 0, 'game_over_bg').setOrigin(0).setAlpha(0);
				let try_again = this.add.image(448, 374, 'try_again').setOrigin(0).setAlpha(0);
				try_again.setTint('0xffea00');
				try_again.setInteractive();

				try_again.on('pointerover', () => {
					try_again.setTint('0xffffff');
				});

				try_again.on('pointerout', () => {
					try_again.setTint('0xffea00');
				});


				try_again.on('pointerup', () => {
					game.scene.start('main_menu');
					game.scene.stop('game_over');
				});

				this.tweens.add({
					targets: game_over_screen,
					duration: 1000,
					alpha: 1,
					ease: 'Sine.easeIn'
				}).on('complete', () => {
					this.tweens.add({
						targets: try_again,
						duration: 1000,
						alpha: 1,
						ease: 'Sine.easeIn'
					});
				});
			});

			reach_tween.play();
		});
	}
});

var Main_Menu = new Phaser.Class({
	Extends: Phaser.Scene,
	initialize: function Main_Menu() {
		Phaser.Scene.call(this, {key: 'main_menu'});
	},

	preload: function () {
		this.load.spritesheet('pacman', 'assets/pacman.png', {frameWidth: 52, frameHeight: 52, spacing: 2});
		this.load.spritesheet('switch', 'assets/switch.png', {frameWidth: 16, frameHeight: 16, spacing: 2});

		this.load.image('grid_bg', 'https://i.imgur.com/IH2Xlq7.png');
		this.load.image('node_trigger', 'assets/circle.png');
		this.load.image('pactileset', 'https://i.imgur.com/m6pk1wQ.png');
		this.load.image('blue_bar', 'assets/blue_bar.png');
		this.load.image('game_over_pacman', 'https://dl.dropbox.com/s/f988j3xqe5fipg7/gameover_pacman.png');
		this.load.image('pacman_hand', 'http://dl.dropbox.com/s/05drguhfupi7ff0/pacman_reach.png');
		this.load.image('game_over_bg', 'assets/game_over_bg.png');
		this.load.image('try_again', 'assets/try_again.png');
		this.load.image('letsplay', 'assets/letsplay.png');
		this.load.image('nothanks', 'assets/nothanks.png');
		this.load.image('menu_bg', 'assets/menu_bg.png');

		this.load.tilemapTiledJSON('stage_1', 'src/stages/stage_1.json');

		this.load.audio('snake', 'https://dl.dropbox.com/s/g4axwvihpfedjou/snake%3F.ogg');
		this.load.audio('gameover', 'https://dl.dropbox.com/s/pfdj9t07q9kc0qp/gameover.mp3');
		this.load.audio('crack', 'assets/crack.mp3');
		this.load.audio('pacman_move', 'https://dl.dropbox.com/s/sm101gcabae33gn/pacman_siren.mp3')

		this.load.spritesheet('ghost', 'https://i.imgur.com/LQmi5bg.png', {frameWidth: 28, frameHeight: 28});
	},

	create: function () {
		this.add.image(0, 0, 'menu_bg').setOrigin(0);

		let play = this.add.image(376, 407, 'letsplay').setOrigin(0);
		let no_thanks = this.add.image(450, 507, 'nothanks').setOrigin(0);
		play.setInteractive();
		no_thanks.setInteractive();
		play.setTint('0xffea00');
		no_thanks.setTint('0x2020ff');

		play.on('pointerover', () => {
			play.setTint('0xffffff');
		});

		play.on('pointerout', () => {
			play.setTint('0xffea00');
		});


		play.on('pointerup', () => {
			game.scene.start('stage_1');
			game.scene.stop('main_menu');
		});

		no_thanks.on('pointerover', () => {
			no_thanks.setTint('0xffffff');
		});

		no_thanks.on('pointerout', () => {
			no_thanks.setTint('0x2020ff');
		});


		no_thanks.on('pointerup', () => {
			this.tweens.add({
				targets: no_thanks,
				duration: 500,
				alpha: 0,
				ease: 'Sine.easeIn'
			}).on('complete', () => {
				no_thanks.destroy();
				no_thanks = null;
			});
		});
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
    scene: [Main_Menu, Stage_1, Game_Over],
    pixelArt: true,
    scale: {
    	mode: Phaser.Scale.FIT
    }
};

var game = new Phaser.Game(config);
