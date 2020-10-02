class WeightedGraph {
	constructor() {
		this.adjList = new Map();
	}
	
	addVertex(v, info = {}) {
		this.adjList.set(v, {...info, edges: []});
	}
	
	getVertex(v) {
		return this.adjList.get(v);
	}

	getSize() {
		return this.adjList.size;
	}
}

class UndirectedGraph extends WeightedGraph {
	addEdge(v1, v2, weight) {
		this.adjList.get(v1).edges.push({edge: v2, weight: weight});
		this.adjList.get(v2).edges.push({edge: v1, weight: weight});
	}
}

class DirectedGraph extends WeightedGraph {	
	addEdge(v1, v2, weight) {
		this.adjList.get(v1).edges.push({edge: v2, weight: weight});
	}
}

function getDistance(pointA, pointB) {
	return Math.sqrt(Math.pow(pointA.x - pointB.x, 2) + Math.pow(pointA.y - pointB.y, 2));
}

function raycast(x0, y0, x1, y1, colliders, debug = false) {
	let ray = new Phaser.Geom.Line(x0, y0, x1, y1);
	if(debug) {
		let graph = game.scene.scenes[0].add.graphics();
		graph.lineStyle(1, 0x00ff00);
	    graph.strokeLineShape(ray);
	}
	var points;

	for(let c = 0; c < colliders.length; c += 1) {
		if(!(colliders[c] instanceof Phaser.Tilemaps.StaticTilemapLayer)) {
			if(!points)
				points = Phaser.Geom.Line.GetPoints(ray, 0, 7);
			let collider_bounds = colliders[c].getBounds();

			for(let k = 0; k < points.length; k += 1)
				if(collider_bounds.contains(points[k].x, points[k].y))
					return true;
		}

		else
			if(colliders[c].getTilesWithinShape(ray, {isNotEmpty: true}).length)
				return true;
	}

	return false;
}

function get_raycast_collisions(x0, y0, x1, y1, [colliders]) {
	let colliding_objects = [];
	let ray = new Phaser.Geom.Line(x0, y0, x1, y1);
	var points;

	colliders.forEach((collider) => {
		if(!(collider instanceof Phaser.Tilemaps.StaticTilemapLayer)) {
			if(!points)
				points = Phaser.Geom.Line.GetPoints(ray, 0, 7);
			let collider_bounds = collider.getBounds();

			for(let c = 0; c < points.length; c += 1) {
				if(collider_bounds.contains(points[c].x, points[c].y)) {
					colliding_objects.push(collider);
					break;
				}
			}
		}

		else
			colliding_objects.concat(collider.getTilesWithinShape(ray, {isNotEmpty: true}));
	});

	return colliding_objects;
}

function getBestPath(graph, start_node, last_node) {
	let priority_queue = new Heapify(graph.getSize());
	let distance = {};
	let previous = {};

	distance[start_node] = 0;
	priority_queue.push({index: start_node, node: graph.getVertex(start_node)}, 1);

	graph.adjList.forEach((node, index) => {
		if(index != start_node)
			distance[index] = Infinity;
		previous[index] = null;
	});

	while(priority_queue.size) {
		let current_node = priority_queue.pop();

		current_node.node.edges.forEach((edge) => {
			let cost = edge.weight + distance[current_node.index];

			if(cost < distance[edge.edge]) {
				distance[edge.edge] = cost;
				previous[edge.edge] = current_node.index;

				priority_queue.push({index: edge.edge, node: graph.getVertex(edge.edge)}, cost);
			}
		});
	}

	let best_path = [last_node];

	while(best_path[0] != start_node)
		best_path.unshift(previous[best_path[0]]);

	return best_path;
}