class Enemy {
	constructor(scene, x = 0, y = 0, target = null) {
		this.entity = scene.physics.add.sprite(x, y, 'pacman');
		this.entity.setCollideWorldBounds(true);
		this.entity.setGravity(0);

		this.target = target.entity;
		this.scene = scene;
		this.speed = 100;
		
		scene.physics.add.collider(this.entity, this.target, () => {
			scene.sound.add('snake').play();
			target.kill();
			this.target = null;
		});

		scene.anims.create({
			key: 'pac_waka',
			frames: scene.anims.generateFrameNumbers('pacman', { start: 0, end: 2 }),
			frameRate: 12,
			yoyo: true,
			repeat: -1
		});

		this.entity.anims.play('pac_waka', true);
	}

	followTarget() {
		this.entity.rotation = Phaser.Math.Angle.Between(this.entity.x, this.entity.y, this.target.x, this.target.y);
		this.scene.physics.velocityFromRotation(this.entity.rotation, this.speed, this.entity.body.velocity);
	}

	update() {
		
		if(this.target)
			this.followTarget();
		else
			this.entity.setVelocity(0);
	}
}