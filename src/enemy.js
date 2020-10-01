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

		this.path = [];
		this.path_position = 0;
		this.entity.anims.play('pac_waka', true);
	}

	followTarget() {
		this.entity.rotation = Phaser.Math.Angle.Between(this.entity.x, this.entity.y, this.target.x, this.target.y);
		this.scene.physics.velocityFromRotation(this.entity.rotation, this.speed, this.entity.body.velocity);
	}

	setCollisionLayer(collision_layer) {
		this.collision_layer = collision_layer;
	}

	updatePath() {
		this.path = getBestPath(this.pacman_graph, this.path_position, 11);
		this.path = this.path.map((node) => {return this.pacman_graph.getVertex(node)});
	}

	followPath(new_movement) {
		if(new_movement != 2) {
			this.entity.rotation = Phaser.Math.Angle.Between(this.entity.x, this.entity.y, this.path[0].position.x, this.path[0].position.y);
			this.scene.physics.velocityFromRotation(this.entity.rotation, this.speed, this.entity.body.velocity);
		}
	}

	getState() {
		if(this.target) {
			if(cast_ray_into_tilemap(this.entity.x, this.entity.y, this.target.x, this.target.y, this.collision_layer).length)
				return 2;
			return 1;
		}

		return 0;
	}

	update() {
		let state = this.getState();
		switch(state) {
			case 2:
				if(this.update.previous_state != 2)
					this.updatePath();
				this.followPath(this.update.previous_state);
				break;
			case 1:
				this.followTarget();
				break;
			case 0:
				if(this.entity.body.velocity.x || this.entity.body.velocity.y)
					this.entity.setVelocity(0);
				break;
		}

		this.update.previous_state = state;
	}
}