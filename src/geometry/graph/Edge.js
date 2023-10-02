/**
 * Class representing a dot.
 * @extends Point
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
   * @return {Map}
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
   * @return {string}
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
   * Признак перевёрнуторсти ребра относительно профиля
   * @return {boolean}
   */
  is_outer() {
    const {cache} = this;
    if(cache.has(null)) {
      return cache.get(null).is_outer;
    }

    const {profile, startVertex: {point: b}, endVertex: {point: e}} = this;
    if(profile.b.is_nearest(b) || profile.e.is_nearest(e)) {
      return false;
    }
    const {generatrix} = profile;
    const nb = generatrix.getNearestPoint(b);
    const ne = generatrix.getNearestPoint(e);
    const is_outer = generatrix.getOffsetOf(nb) > generatrix.getOffsetOf(ne);
    cache.set(null, {is_outer});
    return is_outer;
  }

  /**
   * Перевёрнутость относительно другого ребра на том же профиле
   * @param egde
   * @return {boolean}
   */
  is_profile_outer(egde) {
    const {cache} = this;
    if(cache.has(egde)) {
      return cache.get(egde).is_outer;
    }
    const is_outer = this.profile === egde.profile && this.is_outer() !== egde.is_outer();
    cache.set(egde, {is_outer});
    return is_outer;
  }


  /**
   * Принадлежность ребра той же стороне, что и запрашиваемого
   * @param {GraphEdge} egde
   * @param {GraphVertex} vertex
   * @return {boolean}
   */
  is_some_side(profile, vertex) {
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
      some_side = Boolean(this.is_outer() ^ profile_outer);
    }
    cache.set(profile, {some_side});

    return some_side;
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
    if(this.is_outer()) {
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

