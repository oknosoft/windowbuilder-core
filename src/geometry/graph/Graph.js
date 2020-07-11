// https://github.com/trekhleb/javascript-algorithms


class Graph {
  /**
   * @param {Object} owner
   */
  constructor(owner) {
    this.vertices = {};
    this.edges = {};
    this.isDirected = true;
    this.owner = owner;
    this.project = owner.project || owner;
    this.cache = new Map();
  }

  /**
   * Чистит граф
   */
  clear() {
    this.cache.clear();
    for(const edge of this.getAllEdges().reverse()) {
      this.deleteEdge(edge);
    }
    for(const vertex of this.getAllVertices()) {
      this.deleteVertex(vertex);
    }
  }

  /**
   * @param {GraphVertex} newVertex
   * @returns {Graph}
   */
  addVertex(newVertex) {
    this.vertices[newVertex.getKey()] = newVertex;
    return this;
  }

  /**
   * @param {string} vertexKey
   * @returns GraphVertex
   */
  getVertexByKey(vertexKey) {
    return this.vertices[vertexKey];
  }

  /**
   * @param {GraphVertex} vertex
   * @returns {GraphVertex[]}
   */
  getNeighbors(vertex) {
    return vertex.getNeighbors();
  }

  /**
   * @return {GraphVertex[]}
   */
  getAllVertices() {
    return Object.values(this.vertices);
  }

  /**
   * @param {GraphVertex} vertex
   * @return {Graph}
   */
  deleteVertex(vertex) {
    delete this.vertices[vertex.getKey()];
    return this;
  }

  /**
   * @return {GraphEdge[]}
   */
  getAllEdges() {
    return Object.values(this.edges);
  }

  /**
   * @param {GraphEdge} edge
   * @returns {Graph}
   */
  addEdge(edge) {
    // Try to find and end start vertices.
    let startVertex = this.getVertexByKey(edge.startVertex.getKey());
    let endVertex = this.getVertexByKey(edge.endVertex.getKey());

    // Insert start vertex if it wasn't inserted.
    if (!startVertex) {
      this.addVertex(edge.startVertex);
      startVertex = this.getVertexByKey(edge.startVertex.getKey());
    }

    // Insert end vertex if it wasn't inserted.
    if (!endVertex) {
      this.addVertex(edge.endVertex);
      endVertex = this.getVertexByKey(edge.endVertex.getKey());
    }

    // Check if edge has been already added.
    if (this.edges[edge.getKey()]) {
      throw new Error('Edge has already been added before');
    } else {
      this.edges[edge.getKey()] = edge;
    }

    // Add edge to the vertices.
    if (this.isDirected) {
      // If graph IS directed then add the edge only to start vertex.
      startVertex.addEdge(edge);
      endVertex.addEndEdge(edge);
    }
    else {
      // If graph ISN'T directed then add the edge to both vertices.
      startVertex.addEdge(edge);
      endVertex.addEndEdge(edge);

      endVertex.addEdge(edge);
      startVertex.addEndEdge(edge);
    }

    return this;
  }

  /**
   * @param {GraphEdge} edge
   */
  deleteEdge(edge) {
    // Delete edge from the list of edges.
    delete this.edges[edge.getKey()];

    // Try to find and end start vertices and delete edge from them.
    const startVertex = this.getVertexByKey(edge.startVertex.getKey());
    const endVertex = this.getVertexByKey(edge.endVertex.getKey());

    startVertex.deleteEdge(edge);
    endVertex.deleteEdge(edge);
    this.cache.delete(edge);

  }

  /**
   * @param {GraphVertex} startVertex
   * @param {GraphVertex} endVertex
   * @return {(GraphEdge|null)}
   */
  findEdge(startVertex, endVertex) {
    const vertex = this.getVertexByKey(startVertex.getKey());

    if (!vertex) {
      return null;
    }

    return vertex.findEdge(endVertex);
  }

  /**
   * @return {number}
   */
  getWeight() {
    return this.getAllEdges().reduce((weight, graphEdge) => {
      return weight + graphEdge.weight;
    }, 0);
  }

  /**
   * @return {object}
   */
  getVerticesIndices() {
    const verticesIndices = {};
    this.getAllVertices().forEach((vertex, index) => {
      verticesIndices[vertex.getKey()] = index;
    });

    return verticesIndices;
  }

  /**
   * @return {*[][]}
   */
  getAdjacencyMatrix() {
    const vertices = this.getAllVertices();
    const verticesIndices = this.getVerticesIndices();

    // Init matrix with infinities meaning that there is no ways of
    // getting from one vertex to another yet.
    const adjacencyMatrix = Array(vertices.length).fill(null).map(() => {
      return Array(vertices.length).fill(Infinity);
    });

    // Fill the columns.
    vertices.forEach((vertex, vertexIndex) => {
      vertex.getNeighbors().forEach((neighbor) => {
        const neighborIndex = verticesIndices[neighbor.getKey()];
        adjacencyMatrix[vertexIndex][neighborIndex] = this.findEdge(vertex, neighbor).weight;
      });
    });

    return adjacencyMatrix;
  }

  /**
   * @return {string}
   */
  toString() {
    return Object.keys(this.vertices).toString();
  }

  /**
   * @param {GraphEdge} currentEdge
   * @param {GraphEdge} previousEdge
   * @param {Callbacks} callbacks
   */
  depthFirstSearchRecursive(currentEdge, previousEdge, callbacks) {
    callbacks.enterEdge({currentEdge, previousEdge});
    const edges = currentEdge.endVertex.getEdges();
    edges.forEach((nextEdge) => {
      if(callbacks.allowTraversal({currentEdge, nextEdge, edges})) {
        this.depthFirstSearchRecursive(nextEdge, currentEdge, callbacks);
      }
    });

    callbacks.leaveVertex({currentEdge, previousEdge});
  }

  /**
   * @param {GraphVertex} startVertex
   * @param {Callbacks} [callbacks] {enterVertex, leaveVertex, allowTraversal}
   */
  depthFirstSearch(startEdge, callbacks) {
    this.depthFirstSearchRecursive(startEdge, null, callbacks);
  }

}