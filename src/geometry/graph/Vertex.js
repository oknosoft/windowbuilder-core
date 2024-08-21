
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
    this._cnnType = null;
  }

  /**
   * @summary Указатель на текущий экземпляр метадаты
   * @type {MetaEngine}
   */
  get root() {
    return (this.edges.head?.value || this.endEdges.head?.value)?.profile?.root;
  }

  /**
   * @summary Координата узла
   * @desc При чтении - возвращает точку, при записи - двигает узел
   * @type {paper.Point}
   */
  get point() {
    return this.cnnPoints[0]?.point;
  }
  set point(v) {
    const {point, cnnPoints} = this;
    for(const pt of cnnPoints) {
      pt.point = v;
    }
  }
  
  get isT() {
    return this.cnnPoints.some(pt => pt.isT);
  }

  /**
   * @summary Интеграл соединений, входящих в узел
   * @desc Истина, если выделен хотя бы один из сегментов профилей узла.
   * Направление импостов, может отличаться
   * @type {EnmCnnTypes}
   */
  get cnnType() {
    let {_cnnType, root} = this;
    if(!_cnnType) {
      const {cnnTypes} = this;
      if(cnnTypes.length === 1) {
        this._cnnType = _cnnType = cnnTypes[0];
      }
    }
    return root.enm.cnnTypes.get(_cnnType);
  }
  set cnnType(v) {
    this._cnnType = v;
  }

  /**
   * @summary Доступные типы соединений
   * @type {Array.<EnmCnnTypes>}
   */
  get cnnTypes() {
    const {cnnPoints: {length}, root} = this;
    const types = [];
    if(length) {
      if(length === 1) {
        types.push(this.isT ? 't' : 'i');
      }
      else if(length == 2) {
        types.push('ad', 'ah', 'av');
      }
      else if(length == 3) {
        types.push('cut0');
      }
      else {
        types.push('tt');
      }
    }
    return types.map((v) => (root || $p).enm.cnnTypes.get(v));
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
    const {profile} = edge;
    for(const cnnPoint of [profile.b, profile.e]) {
      const index = this.cnnPoints.indexOf(cnnPoint);
      if(index >= 0) {
        this.cnnPoints.splice(index, 1);
        if(!this.cnnPoints.length) {
          this.cnnPoints.push({point: cnnPoint.point});
        }
      }
    }
  }

  /**
   * @summary Добавляет CnnPoint при необходимости
   * @param {CnnPoint} pt
   */
  addCnnPointIfNearest(pt) {
    if(this.point.isNearest(pt.point)) {
      if(!this.cnnPoints.includes(pt)) {
        if(!this.cnnPoints[0].owner) {
          this.cnnPoints.splice(0, 1);
        }
        this.cnnPoints.push(pt);
      }
    }
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
   * @return {GraphEdge[]}
   */
  getAllEdges() {
    return this.getEdges().concat(this.getEndEdges());
  }

  /**
   * @type {Profile[]}
   */
  get profiles() {
    const profiles = new Set();
    this.getAllEdges().forEach(({profile}) => profiles.add(profile));
    return Array.from(profiles);
  }

  /**
   * @summary Узел выделен
   * @desc Истина, если выделен хотя бы один из сегментов профилей узла.
   * Направление импостов, может отличаться
   * @type {Boolean}
   */
  get selected() {
    const {cnnPoints, point} = this;
    let selected = cnnPoints.some(({selected}) => selected);
    if(!selected) {
      const fullSelected = ({profile: {selected, b, e}}) => selected && (!b.selected && !e.selected || b.selected && e.selected);
      selected = this.getEdges().some(fullSelected) || this.getEndEdges().some(fullSelected);
    }
    return selected;
  }

  /**
   * @return {number}
   */
  getDegree() {
    return this.edges.toArray().length;
  }

  /**
   * @param {GraphEdge} requiredEdge
   * @return {boolean}
   */
  hasEdge(requiredEdge) {
    const edgeNode = this.edges.find({
      callback: edge => edge === requiredEdge,
    });

    return !!edgeNode;
  }

  /**
   * @param {GraphVertex} vertex
   * @return {boolean}
   */
  hasNeighbor(vertex) {
    const vertexNode = this.edges.find({
      callback: edge => edge.startVertex === vertex || edge.endVertex === vertex,
    });

    return !!vertexNode;
  }

  /**
   * @param {GraphVertex} vertex
   * @return {(GraphEdge|null)}
   */
  findEdge(vertex) {
    const callback = (edge) => edge.startVertex === vertex || edge.endVertex === vertex;
    const edge = this.edges.find({ callback });
    return edge ? edge.value : null;
  }

  /**
   * @type {string}
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
   * @return {string}
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

