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
    const {profile, startVertex: {point: b}, endVertex: {point: e}} = this;
    if(profile.b.is_nearest(b) || profile.e.is_nearest(e)) {
      return false;
    }
    const {generatrix} = profile;
    const nb = generatrix.getNearestPoint(b);
    const ne = generatrix.getNearestPoint(e);
    return generatrix.getOffsetOf(nb) > generatrix.getOffsetOf(ne);
  }

  /**
   * Перевёрнутость относительно другого ребра на том же профиле
   * @param egde
   */
  is_profile_outer(egde) {
    return this.profile === egde.profile && this.is_outer() !== egde.is_outer();
  }

  /**
   * Касательная в точке
   * @param point
   * @return {Point}
   */
  getTangentAt({point}) {
    const {generatrix} = this.profile;
    const offset = generatrix.getOffsetOf(generatrix.getNearestPoint(point));
    let tangent = generatrix.getTangentAt(offset);
    return this.is_outer() ? tangent.negate() : tangent;
  }

  /**
   * @return {string}
   */
  toString() {
    return this.getKey();
  }
}
