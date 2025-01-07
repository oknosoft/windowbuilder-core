/**
 * Ребро графа
 */
export class GraphEdge {
  /**
   * @param {GraphVertex} startVertex
   * @param {GraphVertex} endVertex
   * @param {profile} ProfileItem
   */
  constructor({startVertex, endVertex, profile}) {
    this.startVertex = startVertex;
    this.endVertex = endVertex;
    this.profile = profile;
    this.weight = 0;
    this._cache = profile.skeleton.cache;
  }

  /**
   * Кеш, ассоциированный с текущим ребром
   * @type {Map}
   */
  get cache() {
    let cache = this._cache.get(this);
    if(!cache) {
      cache = new Map();
      this._cache.set(this, cache);
    }
    return cache;
  }

  /**
   * Длина ребра по прямой, может отличаться от длины профиля
   */
  get length() {
    const {startVertex, endVertex} = this;
    return startVertex.point.getDistance(endVertex.point);
  }

  /**
   * @type {string}
   */
  get key() {
    const {startVertex, endVertex} = this;
    return `${startVertex.key}_${endVertex.key}`;
  }
  


  /**
   * @return {GraphEdge}
   */
  reverse() {
    const tmp = this.startVertex;
    this.startVertex = this.endVertex;
    this.endVertex = tmp;
    return this;
  }

  /**
   * @summary Ребро выделено
   * @desc Истина, если выделены начальный и конечный сегменты
   * @type Boolean
   */
  get selected() {
    const {profile} = this;
    const {b, e} = profile;
    return (profile.selected && !b.selected && !e.selected) || (b.selected && e.selected);
  }

  /**
   * Признак перевёрнуторсти ребра относительно профиля
   * @return {boolean}
   */
  isOuter() {
    const {cache} = this;
    if(cache.has(null)) {
      return cache.get(null).isOuter;
    }

    const {profile, startVertex, endVertex} = this;
    if(profile.b.vertex === startVertex || profile.e.vertex === endVertex) {
      return false;
    }
    const {generatrix} = profile;
    const nb = generatrix.getNearestPoint(startVertex.point);
    const ne = generatrix.getNearestPoint(endVertex.point);
    const isOuter = generatrix.getOffsetOf(nb) > generatrix.getOffsetOf(ne);
    cache.set(null, {isOuter});
    return isOuter;
  }

  /**
   * Перевёрнутость относительно другого ребра на том же профиле
   * @param egde
   * @return {boolean}
   */
  isProfileOuter(egde) {
    const {cache} = this;
    if(cache.has(egde)) {
      return cache.get(egde).isOuter;
    }
    const isOuter = this.profile === egde.profile && this.isOuter() !== egde.isOuter();
    cache.set(egde, {isOuter});
    return isOuter;
  }


  /**
   * Принадлежность ребра той же стороне, что и запрашиваемого
   * @param {GraphEdge} egde
   * @param {GraphVertex} vertex
   * @return {boolean}
   */
  isSomeSide(profile, vertex) {
    if(this.profile === profile) {
      return true;
    }
    const {cache} = this;
    if(cache.has(profile)) {
      return cache.get(profile).someSide;
    }

    let someSide = profile.hasCnn(this.profile, vertex);
    if(someSide) {
      const {b, e, generatrix} = profile;
      let pt;
      if(b.point.getDistance(vertex.point, true) < e.point.getDistance(vertex.point, true)) {
        pt = generatrix.getPointAt(100);
      }
      else {
        pt = generatrix.getPointAt(generatrix.length - 100);
      }

      const profileOuter = this.profile.generatrix.pointPos(pt, vertex.point) < 0;
      someSide = Boolean(this.isOuter() ^ profileOuter);
    }
    cache.set(profile, {someSide});

    return someSide;
  }
  
  other(vertex) {
    const {startVertex, endVertex, cnnPoints, profile} = this;
    const other = startVertex === vertex ? endVertex : startVertex;
    const cnnPoint = vertex.cnnPoints.find((v) => v.owner === profile);
    return {other, profileOther: cnnPoint?.other};
  }

  /**
   * @summary Узел с другой стороны ребра
   * @param {GraphVertex} vertex
   * @return {GraphVertex}
   */
  otherProfileVertex(vertex) {
    const {profile} = this;
    const cnnPoint = vertex.cnnPoints.find(pt => pt.owner === profile);
    return cnnPoint?.other?.vertex;
  }

  allProfileVertexes(vertex, profile, res) {
    if(!vertex) {
      profile = this.profile;
      vertex = profile.b.vertex;
      res = new Set();
    }
    if(!res.has(vertex)) {
      res.add(vertex);
      for(const edge of vertex.getEdges()) {
        if(edge.profile === profile) {
          this.allProfileVertexes(edge.endVertex, profile, res);
          break;
        }
      }
    }
    return res;
  }

  /**
   * @summary Касательная в узле
   * @param {GraphVertex} vertex
   * @return {Point}
   */
  getTangentAt(vertex) {
    const {cache} = this;
    if(cache.has(vertex)) {
      return cache.get(vertex).tangent;
    }
    const {point} = vertex;
    const {generatrix} = this.profile;
    const offset = generatrix.getOffsetOf(generatrix.getNearestPoint(point));
    let tangent = generatrix.getTangentAt(offset);
    if(this.isOuter()) {
      tangent = tangent.negate();
    }
    cache.set(vertex, {tangent});
    return tangent;
  }

  /**
   * @return {string}
   */
  toString() {
    return this.key;
  }
}

