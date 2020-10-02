var Stage_1 = new Phaser.Class({
	Extends: Phaser.Scene,
	initialize: function Stage_1() {
		Phaser.Scene.call(this, {key: 'stage_1'});
	},

	preload: function () {
		this.load.spritesheet('pacman', 'assets/pacman.png', {frameWidth: 52, frameHeight: 52, spacing: 2});
		this.load.spritesheet('switch', 'assets/switch.png', {frameWidth: 16, frameHeight: 16, spacing: 2});

		this.load.image('grid_bg', 'https://i.imgur.com/IH2Xlq7.png');
		this.load.image('node_trigger', 'assets/circle.png');
		this.load.image('pactileset', 'https://i.imgur.com/m6pk1wQ.png');
		this.load.image('blue_bar', 'assets/blue_bar.png');

		this.load.tilemapTiledJSON('stage_1', 'src/stages/stage_1.json');

		this.load.audio('snake', 'https://dl.dropbox.com/s/g4axwvihpfedjou/snake%3F.ogg');
		this.load.spritesheet('ghost', 'https://i.imgur.com/LQmi5bg.png', {frameWidth: 28, frameHeight: 28});
		this.load.image('labTile','assets/labTile.png');
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

var Maze_Stage = new Phaser.Class({
	Extends: Phaser.Scene,
	initialize: function Maze_Stage() {
		Phaser.Scene.call(this, {key: 'maze_stage'});
	},
	preload: function () {
		this.load.spritesheet('pacman', 'assets/pacman.png', {frameWidth: 52, frameHeight: 52, spacing: 2});
		this.load.spritesheet('switch', 'assets/switch.png', {frameWidth: 16, frameHeight: 16, spacing: 2});

		this.load.image('grid_bg', 'https://i.imgur.com/IH2Xlq7.png');
		this.load.image('node_trigger', 'assets/circle.png');
		this.load.image('pactileset', 'https://i.imgur.com/m6pk1wQ.png');
		this.load.image('blue_bar', 'assets/blue_bar.png');

		this.load.tilemapTiledJSON('stage_1', 'src/stages/stage_1.json');

		this.load.audio('snake', 'https://dl.dropbox.com/s/g4axwvihpfedjou/snake%3F.ogg');
		this.load.spritesheet('ghost', 'https://i.imgur.com/LQmi5bg.png', {frameWidth: 28, frameHeight: 28});
		this.load.image('labTile','assets/labTile.png');
	},
	create: function () {
		this.stage = new Ministage(this, 'maze_stage', 'labTile');

		this.mazePlayer = new MazePlayer(this,(15*16)+8,8);
		this.cameras.main.setZoom(2);
		this.cameras.main.startFollow(this.mazePlayer.entity);
		this.stage.setPlayer(this.mazePlayer);
	},

	update: function() {
		this.mazePlayer.update();
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
    scene: [Maze_Stage],
    pixelArt: true,
    scale: {
    	mode: Phaser.Scale.FIT
    }
};

var game = new Phaser.Game(config);
