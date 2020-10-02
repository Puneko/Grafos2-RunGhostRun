class Enemy {
	constructor(scene, x = 0, y = 0, target = null) {
		this.entity = scene.physics.add.sprite(x, y, 'pacman');
		this.entity.setCollideWorldBounds(true);
		this.entity.body.setAllowGravity(false);

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

		this.pacman_graph;
		this.path = [];
		this.colliders = [];

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


		// console.log(JSON.parse(JSON.stringify(nodes)))
		return nodes;
	}

	checkNodeReachability(node) {
		if(!raycast(this.entity.x, this.entity.y, node.position.x, node.position.y, this.colliders, true))
			return true;

		if(!(raycast(this.entity.x, this.entity.y, node.position.x, this.entity.y, this.colliders, true) || raycast(node.position.x, this.entity.y, node.position.x, node.position.y, this.colliders, true)))
			return true;

		if(!(raycast(this.entity.x, this.entity.y, this.entity.x, node.position.y, this.colliders, true) || raycast(this.entity.x, node.position.y, node.position.x, node.position.y, this.colliders, true)))
			return true;

		return false;
	}

	update() {
		let state = this.getState();
		switch(state) {
			case 2:
				if(this.update.previous_state != 2) {
					let sorted_nodes = this.getNodesByDistance();
					let closest_node = sorted_nodes.pop();
					if(this.checkNodeReachability(closest_node))
						this.path.unshift(closest_node);
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

		this.update.previous_state = state;
	}
}