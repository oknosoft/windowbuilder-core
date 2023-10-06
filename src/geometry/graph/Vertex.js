
import {LinkedList} from './LinkedList';
import paper from 'paper/dist/paper-core';

/**
 * Узел Графа
 */
export class GraphVertex {
  /**
   * @param {String} value
   * @param {paper.Point|CnnPoint} point
   */
  constructor(value, point) {
    this.value = value;
    this.edges = new LinkedList(GraphVertex.edgeComparator);
    this.endEdges = new LinkedList(GraphVertex.edgeComparator);
    this.neighborsConverter = this.neighborsConverter.bind(this);
    this.cnnPoints = [point instanceof paper.Point ? {point} : point];
  }
  
  get point() {
    return this.cnnPoints[0]?.point;
  }

  /**
   * @param {GraphEdge} edge
   * @returns {GraphVertex}
   */
  addEdge(edge) {
    this.edges.append(edge);
    return this;
  }

  addEndEdge(edge) {
    this.endEdges.append(edge);
    return this;
  }

  /**
   * @param {GraphEdge} edge
   */
  deleteEdge(edge) {
    this.edges.delete(edge);
    this.endEdges.delete(edge);
  }

  /**
   * @param {LinkedListNode} node
   */
  neighborsConverter(node) {
    return node.value.startVertex === this ? node.value.endVertex : node.value.startVertex;
  }

  /**
   * Вершины рёбер, исходящих из узла
   * Return either start or end vertex.
   * For undirected graphs it is possible that current vertex will be the end one.
   * @returns {GraphVertex[]}
   */
  getNeighbors() {
    return this.edges.toArray().map(this.neighborsConverter);
  }

  /**
   * Вершины рёбер, входящих в узел
   * @returns {GraphVertex[]}
   */
  getAncestors() {
    return this.endEdges.toArray().map(this.neighborsConverter);
  }

  /**
   * @return {GraphEdge[]}
   */
  getEdges() {
    return this.edges.toArray().map(({value}) => value);
  }

  /**
   * @return {GraphEdge[]}
   */
  getEndEdges() {
    return this.endEdges.toArray().map(({value}) => value);
  }

  /**
   * @return {Profile[]}
   */
  get profiles() {
    const profiles = new Set();
    this.getEdges().concat(this.getEndEdges()).forEach(({profile}) => profiles.add(profile));
    return Array.from(profiles);
  }

  /**
   * @summary Узел выделен
   * @desc Истина, если выделен хотя бы один из сегментов профилей узла
   * @type Boolean
   */
  get selected() {
    return this.getEdges().some(({profile: {selected, b, e}}) => selected && (!b.selected && !e.selected || b.selected)) || 
      this.getEndEdges().some(({profile: {selected, b, e}}) => selected && (!e.selected && !b.selected || e.selected));
  }

  /**
   * @return {number}
   */
  getDegree() {
    return this.edges.toArray().length;
  }

  /**
   * @param {GraphEdge} requiredEdge
   * @returns {boolean}
   */
  hasEdge(requiredEdge) {
    const edgeNode = this.edges.find({
      callback: edge => edge === requiredEdge,
    });

    return !!edgeNode;
  }

  /**
   * @param {GraphVertex} vertex
   * @returns {boolean}
   */
  hasNeighbor(vertex) {
    const vertexNode = this.edges.find({
      callback: edge => edge.startVertex === vertex || edge.endVertex === vertex,
    });

    return !!vertexNode;
  }

  /**
   * @param {GraphVertex} vertex
   * @returns {(GraphEdge|null)}
   */
  findEdge(vertex) {
    const callback = (edge) => edge.startVertex === vertex || edge.endVertex === vertex;
    const edge = this.edges.find({ callback });
    return edge ? edge.value : null;
  }

  /**
   * @returns {string}
   */
  get key() {
    return this.value;
  }

  /**
   * @return {GraphVertex}
   */
  deleteAllEdges() {
    this.getEdges().forEach(edge => this.deleteEdge(edge));

    return this;
  }

  /**
   * @param {function} [callback]
   * @returns {string}
   */
  toString(callback) {
    return callback ? callback(this.value) : `${this.value}`;
  }

  /**
   * @param {GraphEdge} edgeA
   * @param {GraphEdge} edgeB
   */
  static edgeComparator(edgeA, edgeB) {
    if (edgeA.key === edgeB.key) {
      return 0;
    }
    return edgeA.key < edgeB.key ? -1 : 1;
  }
}

