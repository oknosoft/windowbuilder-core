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

    const {profile, startVertex: {point: b}, endVertex: {point: e}} = this;
    if(profile.b.point.isNearest(b) || profile.e.point.isNearest(e)) {
      return false;
    }
    const {generatrix} = profile;
    const nb = generatrix.getNearestPoint(b);
    const ne = generatrix.getNearestPoint(e);
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
      return cache.get(profile).some_side;
    }

    let some_side = profile.has_cnn(this.profile, vertex.point);
    if(some_side) {
      const {b, e, generatrix} = profile;
      let pt;
      if(b.getDistance(vertex.point, true) < e.getDistance(vertex.point, true)) {
        pt = generatrix.getPointAt(100);
      }
      else {
        pt = generatrix.getPointAt(generatrix.length - 100);
      }

      const profile_outer = this.profile.generatrix.point_pos(pt, vertex.point) < 0;
      some_side = Boolean(this.isOuter() ^ profile_outer);
    }
    cache.set(profile, {some_side});

    return some_side;
  }
  
  other(vertex) {
    const {startVertex, endVertex, cnnPoints, profile} = this;
    const other = startVertex === vertex ? endVertex : startVertex;
    const cnnPoint = vertex.cnnPoints.find((v) => v.owner === profile);
    return {other, profileOther: cnnPoint?.other};
  }

  otherProfileVertex(vertex) {
    const {profile} = this;
    const cnnPoint = vertex.cnnPoints.find(pt => pt.owner === profile);
    return cnnPoint.other.vertex;
  }

  /**
   * Касательная в точке
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

