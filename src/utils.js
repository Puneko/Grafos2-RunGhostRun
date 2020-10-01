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

function cast_ray_into_tilemap(x0, y0, x1, y1, layer) {
	ray = new Phaser.Geom.Line(x0, y0, x1, y1);
	return layer.getTilesWithinShape(ray, {isNotEmpty: true})
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