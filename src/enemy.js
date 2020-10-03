class Enemy {
	constructor(scene, x = 0, y = 0, target = null) {
		this.entity = scene.physics.add.sprite(x, y, 'pacman');
		this.entity.setCollideWorldBounds(true);
		this.entity.body.setAllowGravity(false);

		this.sound_rage = 500;
		this.move_sound = scene.sound.add('pacman_move', {
			loop: true
		});
		this.move_sound.play();

		this.target = target.entity;
		this.scene = scene;
		this.speed = 100;
		this.entity.setSize(this.entity.width/4, this.entity.height/4, true);
		
		scene.physics.add.collider(this.entity, this.target, () => {
			target.kill();
			this.target = null;
			this.move_sound.stop();
			this.stage_bgm.stop();

			scene.events.once('postupdate', () => {
				game.scene.start('game_over');
				game.scene.stop(scene.scene.key);
			});
		});

		scene.anims.create({
			key: 'pac_waka',
			frames: scene.anims.generateFrameNumbers('pacman', { start: 0, end: 2 }),
			frameRate: 12,
			yoyo: true,
			repeat: -1
		});

		this.pacman_graph;
		this.path = [];
		this.colliders = [];
		this.stage_bgm;

		this.entity.anims.play('pac_waka', true);
	}

	followTarget() {
		this.entity.rotation = Phaser.Math.Angle.Between(this.entity.x, this.entity.y, this.target.x, this.target.y);
		this.scene.physics.velocityFromRotation(this.entity.rotation, this.speed, this.entity.body.velocity);
	}

	addCollider(collider) {
		this.colliders.push(collider);
	}

	updatePath() {
		this.path = getBestPath(this.pacman_graph, this.path[0].index, this.path.pop().index);
		this.path = this.path.map((node) => {return this.pacman_graph.getVertex(node)});
	}

	followPath() {
		if(this.path[0]) {
			this.entity.rotation = Phaser.Math.Angle.Between(this.entity.x, this.entity.y, this.path[0].position.x, this.path[0].position.y);
			this.scene.physics.velocityFromRotation(this.entity.rotation, this.speed, this.entity.body.velocity);
		}

		else
			this.entity.setVelocity(0);
	}

	getState() {
		if(this.target) {
			if(raycast(this.entity.x, this.entity.y, this.target.x, this.target.y, this.colliders))
				return 2;
			return 1;
		}

		return 0;
	}

	getNodesByDistance() {
		let nodes = new Heapify(this.pacman_graph.getSize());

		this.pacman_graph.adjList.forEach((node) => {
			nodes.push(node, getDistance({x: this.entity.x, y: this.entity.y}, {x: node.position.x, y: node.position.y}) + 1);
		});

		return nodes;
	}

	checkNodeReachability(node) {
		if(!raycast(this.entity.x, this.entity.y, node.position.x, node.position.y, this.colliders))
			return 1;

		if(!(raycast(this.entity.x, this.entity.y, node.position.x, this.entity.y, this.colliders) || raycast(node.position.x, this.entity.y, node.position.x, node.position.y, this.colliders)))
			return 2;

		if(!(raycast(this.entity.x, this.entity.y, this.entity.x, node.position.y, this.colliders) || raycast(this.entity.x, node.position.y, node.position.x, node.position.y, this.colliders)))
			return 3;

		return false;
	}

	update() {
		let state = this.getState();
		switch(state) {
			case 2:
				if(this.update.previous_state != 2) {
					let sorted_nodes = this.getNodesByDistance();
					let node;
					let reachability_type;
								
					while((node = sorted_nodes.pop())) {
						if((reachability_type = this.checkNodeReachability(node))) {
							this.path.unshift(node);
							this.updatePath();

							let reachability_aux;

							while(this.path[1] && (reachability_aux = this.checkNodeReachability(this.path[1]))) {
								this.path.shift();
								reachability_type = reachability_aux;
							}

							let tween;

							switch(reachability_type) {
								case 2:
									tween = this.scene.tweens.add({
										targets: this.entity,
										duration: 1000 * getDistance({x: this.path[0].position.x, y: this.entity.y}, {x: this.entity.x, y: this.entity.y})/this.speed,
										x: this.path[0].position.x,
										y: this.entity.y
									});

									tween.on('start', () => {
										if(!this.back_update)
											this.back_update = this.update;
										this.update = function() { return; }

										if(this.entity.x > this.path[0].position.x)
											this.entity.rotation = Math.PI;
										else
											this.entity.rotation = 0;
									});

									tween.on('update', () => {
										if(this.getState() == 1)
											tween.complete();
									});

									tween.on('complete', () => {
										this.update = this.back_update;
									});
									break;
								case 3:
									tween = this.scene.tweens.add({
										targets: this.entity,
										duration: 1000 * getDistance({x: this.entity.x, y: this.path[0].position.y}, {x: this.entity.x, y: this.entity.y})/this.speed,
										x: this.entity.x,
										y: this.path[0].position.y
									});

									tween.on('start', () => {
										if(!this.back_update)
											this.back_update = this.update;
										this.update = function() { return; }

										if(this.entity.y > this.path[0].position.y)
											this.entity.rotation = -Math.PI/2;
										else
											this.entity.rotation = Math.PI/2;
									});

									tween.on('update', () => {
										if(this.getState() == 1)
											tween.complete();
									});

									tween.on('complete', () => {
										this.update = this.back_update;
									});
									break;
							}

							break;
						}
					}

					this.updatePath();
				}

				this.followPath();
				break;
			case 1:
				this.followTarget();
				break;
			case 0:
				if(this.entity.body.velocity.x || this.entity.body.velocity.y)
					this.entity.setVelocity(0);
				break;
		}

		if(this.target) {
			let player_distance = getDistance(this.target.body.position, this.entity.body.position);
			this.move_sound.setVolume(1 - (player_distance/this.sound_rage));
		}

		this.update.previous_state = state;
	}
}