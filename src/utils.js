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