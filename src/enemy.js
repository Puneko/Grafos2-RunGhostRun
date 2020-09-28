class Enemy {
	constructor(scene, x = 0, y = 0, target = null) {
		this.entity = scene.physics.add.sprite(x, y, 'pacman');
		this.entity.setCollideWorldBounds(true);
		this.target = target;
		this.scene = scene;

		scene.anims.create({
			key: 'pac_waka',
			frames: scene.anims.generateFrameNumbers('pacman', { start: 0, end: 2 }),
			frameRate: 12,
			yoyo: true,
			repeat: -1
		});

		this.entity.anims.play('pac_waka', true);
	}
}