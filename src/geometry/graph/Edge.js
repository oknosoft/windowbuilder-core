/**
 * Class representing a dot.
 * @extends Point
 */
class GraphEdge {
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
   * @return {string}
   */
  getKey() {
    const {startVertex, endVertex} = this;
    return `${startVertex.getKey()}_${endVertex.getKey()}`;
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
   * Касательная в точке
   * @param vertex
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
    return this.getKey();
  }
}
