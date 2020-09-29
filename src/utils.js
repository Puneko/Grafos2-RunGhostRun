class WeightedGraph {
	constructor() {
		this.adjList = new Map();
	}
	
	addVertex(v) {
		this.adjList.set(v, []);
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