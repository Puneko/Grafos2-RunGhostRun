class Stage {
	constructor(scene, stage_name, tileset='tilemap') {
		this.map = scene.make.tilemap({ key: stage_name });
		this.tileset = this.map.addTilesetImage(tileset);

		this.wall_layer = this.map.createStaticLayer('Walls', tileset, 0, 0);

		this.stage_info = stages_info[stage_name];
		this.player_spawn_point = stage_info.player_spawn_point;
		this.pacman_spawn_point = stage_info.pacman_spawn_point;
		this.end_area = stage_info.end_area;
		
		this.generatePacmanNodes();
		this.wall_layer.setCollisionBetween(0, 999999);
	}
	
	generatePacmanNodes() {
		this.pacman_graph = new UndirectedGraph();
		this.node_triggers = [];

		this.stage_info.graph.forEach((node) => pacman_graph.addVertex(node.index, {position: {x: node.x, y: node.y}}));

		this.stage_info.graph.forEach((node) => node.edge.forEach((edge) => {
			let node_position = pacman_graph.get(node.index).position;
			let node_trigger = scene.add.image(node_position.x, node_position.y);

			pacman_graph.addEdge(node.index, edge, getDistance(node_position, pacman_graph.get(edge).position));
			scene.physics.add.staticGroup(node_trigger);
			node_triggers.push(node_trigger);
		});
	}
}