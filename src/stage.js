class Stage {
	constructor(scene, stage_name, tileset='tilemap') {
		this.scene = scene;

		this.map = scene.make.tilemap({ key: stage_name });
		this.tileset = this.map.addTilesetImage(tileset);
		this.wall_layer = this.map.createStaticLayer('Walls', tileset, 0, 0);

		this.stage_info = stages_info.get(stage_name);
		this.player_spawn_point = this.stage_info.player_spawn_point;
		this.pacman_spawn_point = this.stage_info.pacman_spawn_point;
		this.end_area = this.stage_info.end_area;

		this.end_area = scene.add.image(this.end_area.start.x, this.end_area.start.y, 'square').setOrigin(0).setAlpha(0).setDisplaySize(this.end_area.end.x - this.end_area.start.x, this.end_area.end.y - this.end_area.start.y);
		scene.physics.add.staticGroup(this.end_area);

		this.wall_layer.setCollisionByExclusion([-1]);

		this.stage_bgm = scene.sound.add('stage_bgm', {
			loop: true
		});
		this.stage_bgm.play();
	}
	
	generatePacmanNodes() {
		this.pacman.pacman_graph = new UndirectedGraph();
		this.node_triggers = [];

		this.stage_info.graph.forEach((node) => this.pacman.pacman_graph.addVertex(node.index, {position: {x: node.x, y: node.y}, index: node.index}));

		this.stage_info.graph.forEach((node) => {
			var node_position = this.pacman.pacman_graph.getVertex(node.index).position;
			let node_trigger = this.scene.add.image(node_position.x, node_position.y, 'node_trigger').setAlpha(0);

			node.edge.forEach((edge) => this.pacman.pacman_graph.addEdge(node.index, edge, getDistance(node_position, this.pacman.pacman_graph.getVertex(edge).position)));

			this.scene.physics.add.staticGroup(node_trigger);
			node_trigger.node_index = node.index;
			this.node_triggers.push(node_trigger);
		});

		if(!this.happy_path)
			this.happy_path = getBestPath(this.pacman.pacman_graph, this.stage_info.first_node, this.stage_info.last_node).map((node) => {return this.pacman.pacman_graph.getVertex(node)});
	}

	updatePacmanNodes(change) {
		let node_edges = this.pacman.pacman_graph.getVertex(change.node).edges;
		for(let c = 0; c < node_edges.length; c += 1) {
			if(node_edges[c].edge == change.edge) {
				node_edges[c].weight = change.weight;
				break;
			}
		}

		node_edges = this.pacman.pacman_graph.getVertex(change.edge).edges;
		for(let c = 0; c < node_edges.length; c += 1) {
			if(node_edges[c].edge == change.node) {
				node_edges[c].weight = change.weight;
				break;
			}
		}
	}

	setPlayer(player) {
		this.scene.physics.add.collider(player.entity, this.wall_layer);
		this.scene.physics.add.overlap(player.entity, this.end_area, () => {
			document.location.reload();
		});
		var wasColliding;

		this.node_triggers.forEach((trigger) => {
			this.scene.physics.add.overlap(trigger, player.entity, () => {
				if (player.last_trigger != trigger.node_index) {
					let index;

					for(let c = 0; c < this.happy_path.length; c += 1) {
						if(this.happy_path[c].index == trigger.node_index) {
							if(this.happy_path[c + 1])
								index = c + 1;
							else
								index = c;
							break;
						}
					}

					if(!index)
						index = this.stage_info.last_node;

					this.pacman.path.push(this.pacman.pacman_graph.getVertex(index));
					this.pacman.updatePath();

					player.last_trigger = trigger.node_index;
				}


				if(!wasColliding)
					player.entity.body.blocked.down = false;
			}, () => {
				wasColliding = player.entity.body.blocked.down;
				return true;
			});
		});

		this.player = player;
	}

	setPacman(pacman) {
		this.pacman = pacman;
		this.pacman.stage_bgm = this.stage_bgm;
		this.generatePacmanNodes();

		this.scene.physics.add.collider(pacman.entity, this.wall_layer);
		pacman.addCollider(this.wall_layer);
		Object.assign(pacman.path, this.happy_path);

		this.node_triggers.forEach((trigger) => {
			this.scene.physics.add.overlap(trigger, pacman.entity, () => {
				pacman.path.shift();
			}, () => {
				if(pacman.path.length && pacman.path[0].index == trigger.node_index)
					return true;
				return false;
			});
		});
	}

	generateEvents() {
		this.stage_info.events.forEach((event) => {
			let event_trigger = this.scene.add.sprite(event.x, event.y, 'switch', 0).setOrigin(0);
			var wasColliding;
			this.scene.physics.add.staticGroup(event_trigger);

			this.scene.physics.add.overlap(event_trigger, this.player.entity, () => {
				if(!wasColliding)
					player.entity.body.blocked.down = false;
				
				if(!event.once) {
					event_trigger.setFrame(1);
					event.once = true;

					event.affects.forEach((effect) => {
						switch(effect.type) {
							case 'door':
								let door = this.scene.physics.add.image(effect.x, effect.transition.y, 'blue_bar').setOrigin(0).setScale(1, effect.height/16).setImmovable().setAlpha(0);
								let fake_door = this.scene.add.image(effect.x, effect.y, 'blue_bar').setOrigin(0).setScale(1, effect.height/16);
								door.body.setAllowGravity(false);


								this.scene.physics.add.collider(door, this.player.entity);
								this.scene.physics.add.collider(door, this.pacman.entity);
								this.pacman.addCollider(door);

								this.scene.tweens.add({
									targets: fake_door,
									duration: 500,
									ease: 'Sine.easeIn',
									y: effect.transition.y
								});

								break;

							case 'graph':
								this.updatePacmanNodes(effect);
								let sorted_nodes = this.pacman.getNodesByDistance();
								let node;
								let reachability_type;

								while((node = sorted_nodes.pop())) {
									if((reachability_type = this.pacman.checkNodeReachability(node))) {
										this.pacman.path.unshift(node);
										this.pacman.updatePath();

										let reachability_aux;

										while(this.pacman.path[1] && (reachability_aux = this.pacman.checkNodeReachability(this.pacman.path[1]))) {
											this.pacman.path.shift();
											reachability_type = reachability_aux;
										}

										let tween;

										switch(reachability_type) {
											case 2:
												tween = this.scene.tweens.add({
													targets: this.pacman.entity,
													duration: 1000 * getDistance({x: this.pacman.path[0].position.x, y: this.pacman.entity.y}, {x: this.pacman.entity.x, y: this.pacman.entity.y})/this.pacman.speed,
													x: this.pacman.path[0].position.x,
													y: this.pacman.entity.y
												});

												tween.on('start', () => {
													if(!this.pacman.back_update)
														this.pacman.back_update = this.pacman.update;
													this.pacman.update = () => { return; }

													if(this.pacman.entity.x > this.pacman.path[0].position.x)
														this.pacman.entity.rotation = Math.PI;
													else
														this.pacman.entity.rotation = 0;
												});

												tween.on('update', () => {
													if(this.pacman.getState() == 1)
														tween.complete();
												});

												tween.on('complete', () => {
													this.pacman.update = this.pacman.back_update;
												});
												break;
											case 3:
												tween = this.scene.tweens.add({
													targets: this.pacman.entity,
													duration: 1000 * getDistance({x: this.pacman.entity.x, y: this.pacman.path[0].position.y}, {x: this.pacman.entity.x, y: this.pacman.entity.y})/this.pacman.speed,
													x: this.pacman.entity.x,
													y: this.pacman.path[0].position.y
												});

												tween.on('start', () => {
													if(!this.pacman.back_update)
														this.pacman.back_update = this.pacman.update;
													this.pacman.update = () => { return; }
													if(this.pacman.entity.y > this.pacman.path[0].position.y)
														this.pacman.entity.rotation = -Math.PI/2;
													else
														this.pacman.entity.rotation = Math.PI/2;
												});

												tween.on('update', () => {
													if(this.pacman.getState() == 1)
														tween.complete();
												});

												tween.on('complete', () => {
													this.pacman.update = this.pacman.back_update;
												});
												break;
										}

										break;
									}
								}

								break;
						}
					});
				}
			}, () => {
				wasColliding = player.entity.body.blocked.down;
			});
		});
	}
}