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

		this.stage_info.graph.forEach((node) => this.pacman_graph.addVertex(node.index, {position: {x: node.x, y: node.y}}));

		this.stage_info.graph.forEach((node) => {
			var node_position = this.pacman_graph.getVertex(node.index).position;
			let node_trigger = this.scene.add.image(node_position.x, node_position.y, 'node_trigger');

			node.edge.forEach((edge) => this.pacman_graph.addEdge(node.index, edge, getDistance(node_position, this.pacman_graph.getVertex(edge).position)));

			this.scene.physics.add.staticGroup(node_trigger);
			this.node_triggers.push(node_trigger);
		});
	}

	setPlayer(player) {
		this.scene.physics.add.collider(player.entity, this.wall_layer);

		this.node_triggers.forEach((trigger) => {
			this.scene.physics.add.overlap(trigger, player.entity, () => {
				trigger.setTint(0xff0000);
			});
		});
	}

	setPacman(pacman) {
		this.scene.physics.add.collider(pacman.entity, this.wall_layer);
	}
}