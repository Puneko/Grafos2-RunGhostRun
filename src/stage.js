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
		
		this.generatePacmanNodes();

		this.wall_layer.setCollisionByExclusion([-1]);
	}
	
	generatePacmanNodes() {
		this.pacman_graph = new UndirectedGraph();
		this.node_triggers = [];

		this.stage_info.graph.forEach((node) => this.pacman_graph.addVertex(node.index, {position: {x: node.x, y: node.y}, index: node.index}));

		this.stage_info.graph.forEach((node) => {
			var node_position = this.pacman_graph.getVertex(node.index).position;
			let node_trigger = this.scene.add.image(node_position.x, node_position.y, 'node_trigger');

			node.edge.forEach((edge) => this.pacman_graph.addEdge(node.index, edge, getDistance(node_position, this.pacman_graph.getVertex(edge).position)));

			this.scene.physics.add.staticGroup(node_trigger);
			node_trigger.node_index = node.index;
			this.node_triggers.push(node_trigger);
		});

		this.happy_path = getBestPath(this.pacman_graph, this.stage_info.first_node, this.stage_info.last_node).map((node) => {return this.pacman_graph.getVertex(node)});
	}

	updatePacmanNodes(change) {
		let node_edges = this.pacman_graph.getVertex(change.node).edges;
		for(let c = 0; c < node_edges.length; c += 1) {
			if(node_edges[c].edge == change.edge) {
				node_edges[c].weight = change.weight;
				break;
			}
		}

		node_edges = this.pacman_graph.getVertex(change.edge).edges;
		for(let c = 0; c < node_edges.length; c += 1) {
			if(node_edges[c].edge == change.node) {
				node_edges[c].weight = change.weight;
				break;
			}
		}
	}

	setPlayer(player) {
		this.scene.physics.add.collider(player.entity, this.wall_layer);
		var wasColliding;

		this.node_triggers.forEach((trigger) => {
			this.scene.physics.add.overlap(trigger, player.entity, () => {
				if (player.lastTrigger != trigger.node_index) {
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

					this.pacman.path.push(this.pacman_graph.getVertex(index));
					this.pacman.updatePath();

					player.lastTrigger = trigger.node_index;
				}
				trigger.setTint(0xff0000);


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
		this.scene.physics.add.collider(pacman.entity, this.wall_layer);
		pacman.addCollider(this.wall_layer);
		pacman.pacman_graph = this.pacman_graph;
		Object.assign(pacman.path, this.happy_path);

		this.node_triggers.forEach((trigger) => {
			this.scene.physics.add.overlap(trigger, pacman.entity, () => {
				pacman.path.shift();
			}, () => {
				if(pacman.path[0].index == trigger.node_index)
					return true;
				return false;
			});
		});

		this.pacman = pacman;
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
								let door = this.scene.physics.add.image(effect.x, effect.y, 'blue_bar').setOrigin(0).setScale(1, effect.height/16).setImmovable();
								door.body.setAllowGravity(false);

								this.scene.physics.add.collider(door, this.player.entity);
								this.scene.physics.add.collider(door, this.pacman.entity);
								this.pacman.addCollider(door);

								this.scene.tweens.add({
									targets: door,
									duration: 500,
									ease: 'Sine.easeIn',
									y: effect.transition.y
								});

								break;

							case 'graph':
								this.updatePacmanNodes(effect);
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